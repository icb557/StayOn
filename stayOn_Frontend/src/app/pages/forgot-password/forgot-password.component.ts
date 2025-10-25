import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email: string = '';
  constructor(private _userService: UserService, private router: Router) {
  }

  requestPasswordReset() {
    if (this.validateEmail(this.email)) {
      this._userService.requestPasswordReset(this.email).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Se ha enviado un correo electrónico para restablecer su contraseña.',
            showConfirmButton: false,
            timer: 1700
          }).then(() => {
            this.router.navigate(['/login']);
          })

        }, error: (error) => {
          console.log(error);
          if (error.status == 404) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El correo electrónico no está registrado.',
              showConfirmButton: false,
              timer: 1700
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al enviar el correo electrónico.',
              showConfirmButton: false,
              timer: 1700
            })
          }
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El correo electrónico no es válido. Ingrese un correo institucional.',
        showConfirmButton: false,
        timer: 1500
      })
    }

  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@elpoli\.edu\.co$/;
    return emailPattern.test(email);
  }

}
