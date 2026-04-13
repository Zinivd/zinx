import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Employee {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class TaskCreateComponent implements OnInit {
  isEditMode: boolean = false;
  taskId: any;

  task: any = {
    name: '',
    project: '',
    employees: [] as number[],
    startdate: '',
    enddate: '',
    status: '',
    description: '',
  };

  // Employee list
  employeeList: Employee[] = [
    { id: 1, name: 'Sheik' },
    { id: 2, name: 'Ravi Kumar' },
    { id: 3, name: 'Priya' },
    { id: 4, name: 'Arjun' },
    { id: 5, name: 'Meena' },
  ];

  // Dropdown state
  dropdownOpen: boolean = false;
  employeeSearch: string = '';

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.getTaskById(this.taskId);
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  // Employee Dropdown
  get filteredEmployees(): Employee[] {
    const term = this.employeeSearch.toLowerCase();
    return this.employeeList.filter((e) => e.name.toLowerCase().includes(term));
  }

  get selectedEmployeeLabel(): string {
    if (this.task.employees.length === 0) return 'Select Employees';
    if (this.task.employees.length === 1) {
      const emp = this.employeeList.find((e) => e.id === this.task.employees[0]);
      return emp ? emp.name : 'Select Employees';
    }
    return `${this.task.employees.length} Employees Selected`;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.employeeSearch = '';
    }
  }

  isSelected(id: number): boolean {
    return this.task.employees.includes(id);
  }

  toggleEmployee(id: number): void {
    const index = this.task.employees.indexOf(id);
    if (index === -1) {
      this.task.employees = [...this.task.employees, id];
    } else {
      this.task.employees = this.task.employees.filter((e: number) => e !== id);
    }
  }

  get allSelected(): boolean {
    return (
      this.filteredEmployees.length > 0 &&
      this.filteredEmployees.every((e) => this.isSelected(e.id))
    );
  }

  get someSelected(): boolean {
    return this.filteredEmployees.some((e) => this.isSelected(e.id)) && !this.allSelected;
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      // Deselect only the visible filtered ones
      const filteredIds = this.filteredEmployees.map((e) => e.id);
      this.task.employees = this.task.employees.filter((id: number) => !filteredIds.includes(id));
    } else {
      // Add all filtered ones not already selected
      const toAdd = this.filteredEmployees.filter((e) => !this.isSelected(e.id)).map((e) => e.id);
      this.task.employees = [...this.task.employees, ...toAdd];
    }
  }

  removeEmployee(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.task.employees = this.task.employees.filter((e: number) => e !== id);
  }

  getEmployeeName(id: number): string {
    return this.employeeList.find((e) => e.id === id)?.name ?? '';
  }

  // CRUD
  getTaskById(id: any) {
    const data = {
      name: 'Front End Developing',
      project: '2',
      employees: [1, 3],
      startdate: '2021-01-01',
      enddate: '2021-02-02',
      status: 'Opened',
      description: 'Nil',
    };
    this.task = data;
  }

  onSubmit() {
    if (this.task.employees.length === 0) {
      this.toastr.error('Please select at least one employee.');
      return;
    }
    if (this.isEditMode) {
      console.log('Update Task', this.task);
      this.toastr.success('Task updated successfully!');
    } else {
      console.log('Add Task', this.task);
      this.toastr.success('Task added successfully!');
    }
  }

  goBack(): void {
    this.location.back();
  }
}
