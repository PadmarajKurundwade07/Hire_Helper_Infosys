import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    first_name: '',
    last_name: '',
    email_id: '',
    phone_number: '',
    profile_picture: ''
  };

  isEditing = false;
  selectedFile: File | null = null;
  passwordInput = '';
  confirmPasswordInput = '';
  apiUrl = environment.apiUrl;
  labels: any = {};

  // Cancel edit confirmation
  showCancelConfirmModal = false;

  // Password change with OTP
  showChangePasswordForm = false;
  passwordChangeVerified = false;
  passwordChangeOTP = '';
  newPasswordForChange = '';
  confirmPasswordForChange = '';

  professionalDetails = {
    skills: 'Web Development, UI/UX Design',
    hourlyRate: 50,
    availability: 'Available for work',
    portfolioUrl: 'https://myportfolio.com'
  };

  constructor(
    private authService: AuthService,
    private langService: LanguageService,
    private modalService: ModalService
  ) {}

  get passwordMismatch(): boolean {
    if (!this.passwordInput && !this.confirmPasswordInput) return false;
    return this.passwordInput !== this.confirmPasswordInput;
  }

  ngOnInit(): void {
    this.langService.lang$.subscribe(() => {
      this.labels = this.langService.getLabels();
    });
    this.fetchProfile();
    const storedProfDetails = localStorage.getItem('professionalDetails');
    if (storedProfDetails) {
      this.professionalDetails = JSON.parse(storedProfDetails);
    }
  }

  fetchProfile(): void {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      },
      error: (err) => console.error(err)
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.showCancelConfirmModal = true;
    } else {
      this.isEditing = true;
    }
  }

  confirmCancelEdit() {
    this.isEditing = false;
    this.fetchProfile();
    this.selectedFile = null;
    this.passwordInput = '';
    this.confirmPasswordInput = '';
    this.showCancelConfirmModal = false;
    const storedProfDetails = localStorage.getItem('professionalDetails');
    if (storedProfDetails) {
      this.professionalDetails = JSON.parse(storedProfDetails);
    }
  }

  cancelCancelEdit() {
    this.showCancelConfirmModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  saveProfile() {
    if (this.passwordMismatch) {
      this.modalService.show('Error', this.labels.passwordMismatch || 'Passwords do not match!', 'error');
      return;
    }

    // Ask for confirmation before saving
    if (!confirm('Are you sure you want to save these changes?')) {
      return;
    }

    const formData = new FormData();
    formData.append('first_name', this.user.first_name);
    formData.append('last_name', this.user.last_name);
    formData.append('email_id', this.user.email_id);
    if (this.user.phone_number) formData.append('phone_number', this.user.phone_number);
    if (this.passwordInput && !this.passwordMismatch) formData.append('password', this.passwordInput);
    if (this.selectedFile) formData.append('profile_picture', this.selectedFile);

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.user = res;
        this.isEditing = false;
        this.passwordInput = '';
        this.confirmPasswordInput = '';
        this.selectedFile = null;
        localStorage.setItem('professionalDetails', JSON.stringify(this.professionalDetails));
        this.modalService.show('Success', 'Profile updated successfully!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.modalService.show('Error', 'Failed to update profile.', 'error');
      }
    });
  }

  // Password Change with OTP Verification
  initiatePasswordChange() {
    this.showChangePasswordForm = true;
    this.passwordChangeVerified = false;
    this.passwordChangeOTP = '';
    this.newPasswordForChange = '';
    this.confirmPasswordForChange = '';

    // Call forgot password endpoint to send OTP
    this.authService.forgotPassword(this.user.email_id).subscribe({
      next: () => {
        this.modalService.show('Success', 'OTP has been sent to your email!', 'success');
      },
      error: (err) => {
        this.modalService.show('Error', 'Failed to send OTP. Please try again.', 'error');
        this.showChangePasswordForm = false;
      }
    });
  }

  verifyPasswordChangeOTP() {
    if (!this.passwordChangeOTP || this.passwordChangeOTP.length !== 6) {
      this.modalService.show('Error', 'Please enter a valid 6-digit OTP.', 'error');
      return;
    }

    // Verify OTP using the same endpoint as forgot password
    this.authService.verifyOtp(this.user.email_id, this.passwordChangeOTP).subscribe({
      next: () => {
        this.passwordChangeVerified = true;
        this.modalService.show('Success', 'OTP verified successfully!', 'success');
      },
      error: (err) => {
        this.modalService.show('Error', 'Invalid OTP. Please try again.', 'error');
      }
    });
  }

  saveNewPassword() {
    if (!this.newPasswordForChange || this.newPasswordForChange !== this.confirmPasswordForChange) {
      this.modalService.show('Error', 'Passwords do not match or are empty.', 'error');
      return;
    }

    if (this.newPasswordForChange.length < 6) {
      this.modalService.show('Error', 'Password must be at least 6 characters long.', 'error');
      return;
    }

    // Call reset password endpoint
    this.authService.resetPassword(this.user.email_id, this.passwordChangeOTP, this.newPasswordForChange).subscribe({
      next: () => {
        this.modalService.show('Success', 'Password changed successfully!', 'success');
        this.cancelPasswordChange();
      },
      error: (err) => {
        this.modalService.show('Error', 'Failed to change password. Please try again.', 'error');
      }
    });
  }

  cancelPasswordChange() {
    this.showChangePasswordForm = false;
    this.passwordChangeVerified = false;
    this.passwordChangeOTP = '';
    this.newPasswordForChange = '';
    this.confirmPasswordForChange = '';
  }
}
