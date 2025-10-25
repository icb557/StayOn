import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    lastName1: new FormControl('', Validators.required),
    secondLastName: new FormControl(''),
    major: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
  });
  constructor(private router: Router, private _userserService: UserService) {}
  saveUser() {
    if (this.userForm.valid) {
      const user: Omit<User, 'id'> = {
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
        firstName: this.userForm.value.firstName!,
        middleName: this.userForm.value.middleName!,
        lastName: this.userForm.value.lastName1!,
        secondLastName: this.userForm.value.secondLastName!,
        major: this.userForm.value.major!,
        role: 'student',
        age: Number(this.userForm.value.age)!,
      };
      this._userserService.createUser(user as User).subscribe((data) => {
        Swal.fire({
          title: 'User Created Successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.userForm.reset();
        this.router.navigate(['/login']);
      });
    }
  }
}
