import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  errorMsg = '';
  successMsg = '';

  // Separate loading states
  isRegisterLoading = false;
  isOtpLoading = false;

  step = 1; // 1 = Registration, 2 = OTP Verification

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: [''],
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.isRegisterLoading = true;
      this.errorMsg = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isRegisterLoading = false;
          this.successMsg = res.msg;
          this.step = 2; // Move to OTP step
        },
        error: (err) => {
          this.isRegisterLoading = false;
          this.errorMsg = err.error?.msg || 'Registration failed. Please try again.';
        }
      });
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.isOtpLoading = true;
      this.errorMsg = '';
      const email = this.registerForm.get('email_id')?.value;
      const otp = this.otpForm.get('otp')?.value;

      this.authService.verifyOtp(email, otp).subscribe({
        next: (res) => {
          this.isOtpLoading = false;
          this.successMsg = 'Verification successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          this.isOtpLoading = false;
          this.errorMsg = err.error?.msg || 'OTP Verification failed.';
        }
      });
    }
  }
}
