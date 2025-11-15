import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private _userserService: UserService) {
    const role = localStorage.getItem('role');
  }

  login() {
    if (this.validateData()) {
      this._userserService.login(this.email, this.password).subscribe({
        next: (data) => {
          const token = data.token;
          const payload: any = jwtDecode(token);
          localStorage.setItem('token', token);
          localStorage.setItem('role', payload.rol);
          localStorage.setItem('email', payload.email);
          localStorage.setItem('firstName', payload.firstName);
          localStorage.setItem('id', payload.id.toString());

          this.router.navigate(['/']);
        },
        error: (e: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales incorrectas',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    }
  }
  validateData() {
    if (this.email === '' || this.password === '') {
      Swal.fire({
        icon: 'info',
        title: '',
        text: 'Por favor ingresar todos los datos',
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
    const validPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!validPassword.test(this.password)) {
      Swal.fire({
        icon: 'info',
        title: 'Contraseña invalida',
        text: `
          - Longitud 8 o más
          - Una Mayús
          - Un número 
          - Un símbolo 
        `,
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
    return true;
  }
}
