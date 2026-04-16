import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  showPassword: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
