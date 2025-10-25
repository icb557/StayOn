import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reset-password',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  showPassword = false;
  showPassword2 = false;
  token: string = '';


  constructor(private _userService: UserService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (this.token) {
        const decoded: JwtPayload = jwtDecode(this.token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El token ha expirado.',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = '/login';
          });
        }
      }
    });

    this.resetForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.passwwordEquals();
    });

    this.resetForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.passwwordEquals();
    });
  }
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
  resetForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
  })

  togglePassword(visible: boolean) {
    this.showPassword = visible;
  }

  togglePassword2(visible: boolean) {
    this.showPassword2 = visible;
  }

  passwwordEquals() {
    if (this.resetForm.get('newPassword')?.value !== this.resetForm.get('confirmPassword')?.value) {
      this.resetForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.resetForm.get('confirmPassword')?.setErrors(null);
    }
  }

  resetPassword() {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.get('newPassword')?.value;
      this._userService.resetPassword(this.token, newPassword!).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Conntrasela restablecida!',
            text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.href = '/login';
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Un error ha ocurrido al restablecer la contraseña.',
            showConfirmButton: false,
            timer: 1500
          })
        },
      }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos correctamente.',
        showConfirmButton: false,
        timer: 1700
      })
    }
  }
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}
