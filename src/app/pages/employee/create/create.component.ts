import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})

export class EmployeeCreateComponent implements OnInit {
  isEditMode: boolean = false;
  employeeId: any;

  employee: any = {
    name: '',
    designation: '',
    email: '',
    contact: '',
    address: '',
    payType: '',
    salary: '',
    aadharNo: ''
  };

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (this.employeeId) {
      this.isEditMode = true;
      this.getEmployeeById(this.employeeId);
    }
  }

  getEmployeeById(id: any) {
    // Mock data
    const data = {
      name: 'Sheik',
      designation: 'Frontend Developer',
      email: 'sheik@gmail.com',
      contact: '9876543210',
      address: 'Salem',
      payType: 'monthly',
      salary: 30000,
      aadharNo: '1234 5678 9012'
    };

    this.employee = data;
  }

  onSubmit() {
    if (this.isEditMode) {
      // Update API
      console.log('Update Employee');
    } else {
      // Create API
      console.log('Add Employee');
    }
  }

  validateContact(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  validateAadhar(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 12);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = formatted;
  }

  goBack(): void {
    this.location.back();
  }
}
