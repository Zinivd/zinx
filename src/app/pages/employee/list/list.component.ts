// =============================================================
// src/app/pages/employee/list/list.component.ts  — UPDATED
// =============================================================

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../models';

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[]       = [];
  selectedEmployee: Employee | null = null;
  isLoading = false;

  // Search & Pagination
  searchText   = '';
  currentPage  = 1;
  itemsPerPage = 10;
  totalItems   = 0;
  lastPage     = 1;

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAll({
      search:   this.searchText || undefined,
      page:     this.currentPage,
      per_page: this.itemsPerPage,
    }).subscribe({
      next: (res) => {
        this.isLoading    = false;
        this.employees    = res.data;
        this.totalItems   = res.meta.total;
        this.lastPage     = res.meta.last_page;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load employees');
      },
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  prevPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void { this.goToPage(this.currentPage + 1); }

  get pageNumbers(): number[] {
    return Array.from({ length: this.lastPage }, (_, i) => i + 1);
  }

  viewEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
  }

  toggleActive(emp: Employee): void {
    this.employeeService.toggleStatus(emp.id).subscribe({
      next: (res) => {
        emp.is_active = res.data!.is_active;
        const status  = emp.is_active ? 'activated' : 'deactivated';
        this.toastr.success(`Employee ${emp.name} has been ${status}.`);
      },
      error: () => this.toastr.error('Failed to update status'),
    });
  }

  deleteEmployee(emp: Employee): void {
    if (!confirm(`Delete employee "${emp.name}"? This cannot be undone.`)) return;
    this.employeeService.delete(emp.id).subscribe({
      next: () => {
        this.toastr.success('Employee deleted successfully');
        this.loadEmployees();
      },
      error: () => this.toastr.error('Failed to delete employee'),
    });
  }
}
