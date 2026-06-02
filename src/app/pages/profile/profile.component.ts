
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isLoading    = false;
  isSubmitting = false;

  profile: any = {
    name: '', email: '', phone: '', designation: '', address: '', profile_image: null as File | null,
  };

  passwordForm = { current_password: '', new_password: '', new_password_confirmation: '' };
  previewImage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void { this.loadProfile(); }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status && res.data) {
          const p = res.data;
          this.profile = {
            name: p.name, email: p.email, phone: p.phone ?? '',
            designation: p.designation ?? '', address: p.address ?? '',
            profile_image: null,
          };
          this.previewImage = p.profile_image;
        }
      },
      error: () => { this.isLoading = false; this.toastr.error('Failed to load profile'); },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.profile.profile_image = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  onUpdateProfile(): void {
    this.isSubmitting = true;
    this.profileService.updateProfile(this.profile).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.status) this.toastr.success('Profile updated successfully');
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err?.error?.errors;
        if (errors) Object.values(errors).forEach((m: any) => this.toastr.error(m[0]));
        else this.toastr.error('Failed to update profile');
      },
    });
  }

  onChangePassword(): void {
    if (!this.passwordForm.current_password || !this.passwordForm.new_password) {
      this.toastr.error('Please fill all password fields');
      return;
    }
    this.profileService.changePassword(this.passwordForm).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success('Password changed successfully');
          this.passwordForm = { current_password: '', new_password: '', new_password_confirmation: '' };
        }
      },
      error: (err) => {
        const errors = err?.error?.errors;
        if (errors) Object.values(errors).forEach((m: any) => this.toastr.error(m[0]));
        else this.toastr.error(err?.error?.message || 'Failed to change password');
      },
    });
  }

  validateContact(event: any): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
  }

  goBack(): void { this.location.back(); }
}
