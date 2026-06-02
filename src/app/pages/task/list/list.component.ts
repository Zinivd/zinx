
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../models';

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[]           = [];
  selectedTask: Task | null = null;
  isLoading = false;

  searchText   = '';
  currentPage  = 1;
  itemsPerPage = 10;
  totalItems   = 0;
  lastPage     = 1;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void { this.loadTasks(); }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAll({
      search:   this.searchText || undefined,
      page:     this.currentPage,
      per_page: this.itemsPerPage,
    }).subscribe({
      next: (res) => {
        this.isLoading  = false;
        this.tasks      = res.data;
        this.totalItems = res.meta.total;
        this.lastPage   = res.meta.last_page;
      },
      error: () => { this.isLoading = false; this.toastr.error('Failed to load tasks'); },
    });
  }

  onSearchChange(): void { this.currentPage = 1; this.loadTasks(); }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage) { this.currentPage = page; this.loadTasks(); }
  }
  prevPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void { this.goToPage(this.currentPage + 1); }
  get pageNumbers(): number[] { return Array.from({ length: this.lastPage }, (_, i) => i + 1); }

  viewTask(t: Task): void { this.selectedTask = t; }

  deleteTask(t: Task): void {
    if (!confirm(`Delete task "${t.name}"?`)) return;
    this.taskService.delete(t.id).subscribe({
      next: () => { this.toastr.success('Task deleted'); this.loadTasks(); },
      error: () => this.toastr.error('Failed to delete task'),
    });
  }
}
