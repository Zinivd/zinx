import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

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
