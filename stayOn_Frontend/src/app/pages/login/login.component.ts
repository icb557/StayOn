import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

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
  } // Inject any required services here

  login() {
    if (this.validateData()) {
      this._userserService.login(this.email, this.password).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('email', data.email);
          localStorage.setItem('firstName', data.firstName);
          localStorage.setItem('id', data.id.toString());

          this.router.navigate(['/']);
        },
        error: (e: HttpErrorResponse) => {
          alert('Invalid credentials');
        },
      });
    }
  }
  validateData() {
    if (this.email === '' || this.password === '') {
      alert('Please fill in all fields!');
      return false;
    }
    const validPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!validPassword.test(this.password)) {
      alert(
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!'
      );
      return false;
    }
    return true;
  }
}
