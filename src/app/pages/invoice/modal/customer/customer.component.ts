import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  validateContact(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  validateGST(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 15) {
      input.value = input.value.slice(0, 15);
    }
  }
}
