import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

export interface Employee {
  id: number;
  name: string;
  designation: string;
  email: string;
  contact: string;
  address: string;
  payType?: string;
  salary?: number;
  aadharCard?: string;
  profileImage?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [
    {
      id: 1,
      name: 'Sheik',
      designation: 'Front End Developer',
      email: 'sheik@gmail.com',
      contact: '+91 9876543210',
      address: 'Salem',
      payType: 'Monthly',
      salary: 30000,
      aadharCard: '1234 5678 9012',
      profileImage: 'assets/images/Avatar.png',
      isActive: true,
    },
    {
      id: 2,
      name: 'Priya',
      designation: 'UI/UX Designer',
      email: 'priya@gmail.com',
      contact: '+91 9988776655',
      address: 'Coimbatore',
      payType: 'Monthly',
      salary: 28000,
      aadharCard: '1122 3344 5566',
      profileImage: 'assets/images/Avatar.png',
      isActive: true,
    },
  ];

  // Search
  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Selected employee for view modal
  selectedEmployee: Employee | null = null;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Search
  get filteredEmployees(): Employee[] {
    if (!this.searchText.trim()) {
      return this.employees;
    }
    const term = this.searchText.toLowerCase();
    return this.employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.contact.toLowerCase().includes(term) ||
        emp.address.toLowerCase().includes(term),
    );
  }

  onSearchChange(): void {
    this.currentPage = 1; // reset to first page on new search
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage) || 1;
  }

  get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
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
  viewEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
  }

  // Toggle Active
  toggleActive(employee: Employee): void {
    employee.isActive = !employee.isActive;
    const status = employee.isActive ? 'activated' : 'deactivated';
    this.toastr.success(`Employee ${employee.name} has been ${status}.`);
  }
}
