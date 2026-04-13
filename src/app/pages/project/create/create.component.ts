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
export class ProjectCreateComponent implements OnInit {
  isEditMode: boolean = false;
  projectId: any;

  project: any = {
    name: '',
    clientname: '',
    contact: '',
    address: '',
    gstno: '',
    quotation: '',
    type: '',
    deadline: '',
  };

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');

    if (this.projectId) {
      this.isEditMode = true;
      this.getProjectById(this.projectId);
    }
  }

  getProjectById(id: any) {
    // Mock data
    const data = {
      name: 'ECommerce',
      clientname: 'Sheik',
      contact: '9876543210',
      address: 'Salem',
      gstno: '1234567890',
      quotation: 100000,
      type: 'Fixed',
      deadline: '2021-01-01',
    };

    this.project = data;
  }

  onSubmit() {
    if (this.isEditMode) {
      // Update API
      console.log('Update Project');
    } else {
      // Create API
      console.log('Add Project');
    }
  }

  validateContact(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  validateGST(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    input.value = input.value.toUpperCase();
    if (input.value.length > 15) {
      input.value = input.value.slice(0, 15);
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
