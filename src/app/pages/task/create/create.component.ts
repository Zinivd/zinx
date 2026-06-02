
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ProjectService } from '../../../core/services/project.service';
import { EmployeeDropdown, ProjectDropdown } from '../../../models/index';

@Component({
  selector: 'app-create',
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class TaskCreateComponent implements OnInit {
  isEditMode   = false;
  taskId: number | null = null;
  isSubmitting = false;

  task: any = {
    name: '', project_id: '', employees: [] as number[],
    start_date: '', end_date: '', status: 'Opened', description: '',
  };

  employeeList: EmployeeDropdown[] = [];
  projectList:  ProjectDropdown[]  = [];

  dropdownOpen    = false;
  employeeSearch  = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private elRef: ElementRef,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEditMode = true; this.taskId = +id; this.loadTask(+id); }
  }

  loadDropdowns(): void {
    this.employeeService.getAllForDropdown().subscribe({
      next: (res) => { if (res.status) this.employeeList = res.data ?? []; },
    });
    this.projectService.getAllForDropdown().subscribe({
      next: (res) => { if (res.status) this.projectList = res.data ?? []; },
    });
  }

  loadTask(id: number): void {
    this.taskService.getById(id).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          const t = res.data;
          this.task = {
            name: t.name, project_id: t.project_id,
            employees: t.employee_ids, start_date: t.start_date ?? '',
            end_date: t.end_date ?? '', status: t.status, description: t.description ?? '',
          };
        }
      },
      error: () => { this.toastr.error('Failed to load task'); this.router.navigate(['/task-list']); },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) this.dropdownOpen = false;
  }

  get filteredEmployees(): EmployeeDropdown[] {
    const term = this.employeeSearch.toLowerCase();
    return this.employeeList.filter(e => e.name.toLowerCase().includes(term));
  }

  get selectedEmployeeLabel(): string {
    if (!this.task.employees.length) return 'Select Employees';
    if (this.task.employees.length === 1) {
      return this.employeeList.find(e => e.id === this.task.employees[0])?.name ?? 'Select Employees';
    }
    return `${this.task.employees.length} Employees Selected`;
  }

  toggleDropdown(): void { this.dropdownOpen = !this.dropdownOpen; if (this.dropdownOpen) this.employeeSearch = ''; }
  isSelected(id: number): boolean { return this.task.employees.includes(id); }
  toggleEmployee(id: number): void {
    const idx = this.task.employees.indexOf(id);
    this.task.employees = idx === -1 ? [...this.task.employees, id] : this.task.employees.filter((e: number) => e !== id);
  }
  get allSelected(): boolean { return this.filteredEmployees.length > 0 && this.filteredEmployees.every(e => this.isSelected(e.id)); }
  toggleSelectAll(): void {
    if (this.allSelected) {
      const ids = this.filteredEmployees.map(e => e.id);
      this.task.employees = this.task.employees.filter((id: number) => !ids.includes(id));
    } else {
      const toAdd = this.filteredEmployees.filter(e => !this.isSelected(e.id)).map(e => e.id);
      this.task.employees = [...this.task.employees, ...toAdd];
    }
  }
  removeEmployee(id: number, e: MouseEvent): void { e.stopPropagation(); this.task.employees = this.task.employees.filter((x: number) => x !== id); }
  getEmployeeName(id: number): string { return this.employeeList.find(e => e.id === id)?.name ?? ''; }

  onSubmit(): void {
    if (!this.task.employees.length) { this.toastr.error('Please select at least one employee.'); return; }
    this.isSubmitting = true;

    const action = this.isEditMode
      ? this.taskService.update(this.taskId!, this.task)
      : this.taskService.create(this.task);

    action.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.status) {
          this.toastr.success(this.isEditMode ? 'Task updated!' : 'Task created!');
          this.router.navigate(['/task-list']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err?.error?.errors;
        if (errors) Object.values(errors).forEach((m: any) => this.toastr.error(m[0]));
        else this.toastr.error(err?.error?.message || 'Something went wrong');
      },
    });
  }

  goBack(): void { this.location.back(); }
}
