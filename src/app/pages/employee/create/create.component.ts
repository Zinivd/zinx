// =============================================================
// src/app/pages/employee/create/create.component.ts  — UPDATED
// =============================================================

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class EmployeeCreateComponent implements OnInit {
  isEditMode  = false;
  employeeId: number | null = null;
  isLoading   = false;
  isSubmitting = false;

  employee: any = {
    name: '', designation: '', email: '', contact: '',
    address: '', pay_type: '', salary: '', aadhar_card: '',
    profile_image: null as File | null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode  = true;
      this.employeeId  = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status && res.data) {
          const e = res.data;
          this.employee = {
            name: e.name, designation: e.designation, email: e.email,
            contact: e.contact, address: e.address, pay_type: e.pay_type,
            salary: e.salary, aadhar_card: e.aadhar_card ?? '', profile_image: null,
          };
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load employee');
        this.router.navigate(['/employee-list']);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.employee.profile_image = input.files[0];
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;

    const action = this.isEditMode
      ? this.employeeService.update(this.employeeId!, this.employee)
      : this.employeeService.create(this.employee);

    action.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.status) {
          this.toastr.success(this.isEditMode ? 'Employee updated successfully!' : 'Employee created successfully!');
          this.router.navigate(['/employee-list']);
        } else {
          this.toastr.error(res.message || 'Operation failed');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err?.error?.errors;
        if (errors) {
          Object.values(errors).forEach((msgs: any) => this.toastr.error(msgs[0]));
        } else {
          this.toastr.error(err?.error?.message || 'Something went wrong');
        }
      },
    });
  }

  validateContact(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
  }

  validateAadhar(event: any): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '').substring(0, 12);
    input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  goBack(): void { this.location.back(); }
}
