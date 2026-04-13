import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface Task {
  id: number;
  name: string;
  project: string;
  employees: number[];
  startdate: string;
  enddate: string;
  status: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [
    {
      id: 1,
      name: 'UI/UX Designing',
      project: 'Alpha',
      employees: [1, 2, 3],
      startdate: '2021-01-01',
      enddate: '2021-02-02',
      status: 'Opened',
      description: 'Nil',
      isActive: true,
    },
  ];

  // Search
  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Selected employee for view modal
  selectedTask: Task | null = null;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Search
  get filteredTasks(): Task[] {
    if (!this.searchText.trim()) {
      return this.tasks;
    }
    const term = this.searchText.toLowerCase();
    return this.tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term) ||
        task.employees.toString().includes(term) ||
        task.startdate.toLowerCase().includes(term) ||
        task.enddate.toLowerCase().includes(term) ||
        task.status.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term),
    );
  }

  onSearchChange(): void {
    this.currentPage = 1; // reset to first page on new search
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.itemsPerPage) || 1;
  }

  get paginatedTasks(): Task[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTasks.slice(start, start + this.itemsPerPage);
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
  viewTask(task: Task): void {
    this.selectedTask = task;
  }

  // Toggle Active
  toggleActive(task: Task): void {
    task.isActive = !task.isActive;
    const status = task.isActive ? 'opened' : 'closed';
    this.toastr.success(`Task ${task.name} has been ${status}.`);
  }
}
