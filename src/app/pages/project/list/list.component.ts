import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface Project {
  id: number;
  name: string;
  clientname: string;
  email: string;
  contact: string;
  address: string;
  gstno?: string;
  quotation?: number;
  type?: string;
  deadline?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class PorjectListComponent implements OnInit {
  projects: Project[] = [
    {
      id: 1,
      name: 'ECommerce',
      clientname: 'Naveen',
      email: 'naveen@gmail.com',
      contact: '+91 9876543210',
      address: 'Harur',
      gstno: '1234567890',
      quotation: 100000,
      type: 'Fixed',
      deadline: '2021-01-01',
      isActive: true,
    },
  ];

  // Search
  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Selected employee for view modal
  selectedProject: Project | null = null;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Search
  get filteredProjects(): Project[] {
    if (!this.searchText.trim()) {
      return this.projects;
    }
    const term = this.searchText.toLowerCase();
    return this.projects.filter(
      (prjt) =>
        prjt.name.toLowerCase().includes(term) ||
        prjt.clientname.toLowerCase().includes(term) ||
        prjt.email.toLowerCase().includes(term) ||
        prjt.contact.toLowerCase().includes(term) ||
        prjt.address.toLowerCase().includes(term),
    );
  }

  onSearchChange(): void {
    this.currentPage = 1; // reset to first page on new search
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.itemsPerPage) || 1;
  }

  get paginatedProjects(): Project[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProjects.slice(start, start + this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Modal
  viewProject(project: Project): void {
    this.selectedProject = project;
  }

  // Toggle Active
  toggleActive(project: Project): void {
    project.isActive = !project.isActive;
    const status = project.isActive ? 'activated' : 'deactivated';
    this.toastr.success(`Project ${project.name} has been ${status}.`);
  }
}
