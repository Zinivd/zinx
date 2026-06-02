
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../models';

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class PorjectListComponent implements OnInit {
  projects: Project[]             = [];
  selectedProject: Project | null = null;
  isLoading = false;

  searchText   = '';
  currentPage  = 1;
  itemsPerPage = 10;
  totalItems   = 0;
  lastPage     = 1;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void { this.loadProjects(); }

  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAll({
      search:   this.searchText || undefined,
      page:     this.currentPage,
      per_page: this.itemsPerPage,
    }).subscribe({
      next: (res) => {
        this.isLoading  = false;
        this.projects   = res.data;
        this.totalItems = res.meta.total;
        this.lastPage   = res.meta.last_page;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load projects');
      },
    });
  }

  onSearchChange(): void { this.currentPage = 1; this.loadProjects(); }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.loadProjects();
    }
  }
  prevPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void { this.goToPage(this.currentPage + 1); }
  get pageNumbers(): number[] { return Array.from({ length: this.lastPage }, (_, i) => i + 1); }

  viewProject(p: Project): void { this.selectedProject = p; }

  toggleActive(p: Project): void {
    this.projectService.toggleStatus(p.id).subscribe({
      next: (res) => {
        p.is_active    = res.data!.is_active;
        const status   = p.is_active ? 'activated' : 'deactivated';
        this.toastr.success(`Project ${p.name} has been ${status}.`);
      },
      error: () => this.toastr.error('Failed to update status'),
    });
  }

  deleteProject(p: Project): void {
    if (!confirm(`Delete project "${p.name}"?`)) return;
    this.projectService.delete(p.id).subscribe({
      next: () => { this.toastr.success('Project deleted'); this.loadProjects(); },
      error: () => this.toastr.error('Failed to delete project'),
    });
  }
}
