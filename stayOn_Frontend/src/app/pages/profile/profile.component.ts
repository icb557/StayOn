import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profileservice } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { Profile } from '../../interfaces/profile';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FollowerService } from '../../services/follower.service';
import { Material } from '../../interfaces/material';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile: Profile = {} as Profile
  userId: number = 0
  showUserForm = false
  firstName = ''
  lastName = ''
  posts = 0
  followers = 0
  following = 0


  constructor(private aRouter: ActivatedRoute, private _profileService: Profileservice, private _userService: UserService, private _followService: FollowerService, private router: Router) {
  }

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    lastName: new FormControl('', [Validators.required]),
    secondLastName: new FormControl(''),
    major: new FormControl('', [Validators.required]),
    age: new FormControl<number | null>(null, [Validators.required])
  })

  ngOnInit(): void {
    this.aRouter.paramMap.subscribe(params => {
      this.userId = +params.get('userId')!;
      this.getProfile();
      this.getFollowingUser();
    });
  }

  showPost(id: number) {
    this.router.navigate([`/post/${id}`])
  }

  showProfile(id: number) {
    this.router.navigate([`/profile/${id}`])
  }

  updateProfile() {
    this.showUserForm = true
    this.userForm.setValue({
      firstName: this.profile.firstName,
      middleName: this.profile.middleName,
      lastName: this.profile.lastName,
      secondLastName: this.profile.secondLastName,
      major: this.profile.major,
      age: this.profile.age
    })
  }
  saveData() {
    if (!this.userForm.valid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos',
        icon: 'error',
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }

    const user = this.userForm.value as User;
    this._userService.updateUser(this.userId, user).subscribe({
      next: (data) => {
        this.showUserForm = false;
        this.userForm.reset();
        this.getProfile();
        Swal.fire({
          title: 'Usuario actualizado',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200,
        });
      },
      error: (e: HttpErrorResponse) => {
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error',
          icon: 'error',
          showConfirmButton: false,
          timer: 1200,
        });
      },
    });
  }
  cancelEdit() {
    this.showUserForm = false
    this.userForm.reset();
  }

  getProfile() {
    this._profileService.getProfile(this.userId).subscribe({
      next: (data) => {
        this.profile = data
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.posts = data.Posts.length;
        this.followers = data.Followers.length;
        this.following = data.Following.length;
      }, error: (e: HttpErrorResponse) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error ocurred while retrieving your profile data",
          footer: "Please try again later",
          showConfirmButton: false,
          timer: 4000
        });
        if (e.status === 404) {
          console.error('Profile not found', e);
        } else {
          console.error('An error occurred while retrieving your profile data', e);
        }
      }
    })
  }
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const day = date.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${day} de ${month}, ${year} • ${time}`;
  }

  myProfile() {
    const currentUserId = localStorage.getItem('id');
    return currentUserId && this.userId === +currentUserId;
  }

  isFollowing = true;
  isHovered = false;
  hoveredIndex: number | null = null;
  FollowingUser: User[] = [];

  getFollowingUser() {
    const currentUserId = localStorage.getItem('id');
    if (currentUserId) {
      this._followService.getFollowing(+currentUserId).subscribe({
        next: (data) => {
          this.FollowingUser = data;
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error fetching following users', e);
        }
      });
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  userIsFollowing(id: number) {
    return this.FollowingUser.some(user => user.id === id);
  }

  isMyProfile(id: number): boolean {
    const currentUserId = localStorage.getItem('id');
    return currentUserId ? id === +currentUserId : false;

  }

  followUser(id: number) {
    const currentUserId = localStorage.getItem('id');
    if (currentUserId) {
      this._followService.followUser(+currentUserId, id).subscribe({
        next: () => {
          this.isFollowing = true;
          this.getFollowingUser();
          Swal.fire({
            title: 'Usuario seguido',
            icon: 'success',
            showConfirmButton: false,
            timer: 1200,
          }).then(() => {
            window.location.reload();
          });
        },
        error: (e: HttpErrorResponse) => {
          console.error('Error following user', e);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo seguir al usuario',
            icon: 'error',
            showConfirmButton: false,
            timer: 1200,
          });
        }
      });
    }
  }

  unFollow(id: number) {
    const currentUserId = localStorage.getItem('id');
    if (currentUserId) {
      Swal.fire({
        title: "Dejar de seguir usuario",
        text: "Seguro que quieres dejar de seguir a este usuario?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, dejar de seguir",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.unFollowUser(Number(currentUserId), id);
        }
      });
    }
  }

  unFollowUser(currentUserId: number, id: number) {
    this._followService.unfollowUser(+currentUserId, id).subscribe({
      next: () => {
        this.isFollowing = false;
        this.getFollowingUser();
        Swal.fire({
          title: 'Usuario dejado de seguir',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200,
        }).then(() => {
          window.location.reload();
        });
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error unfollowing user', e);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo dejar de seguir al usuario',
          icon: 'error',
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  }

  filterImages(materials: Material[]) {
    return materials.filter(material => material.type.startsWith('image/'));
  }
  filterVideos(materials: Material[]) {
    return materials.filter(material => material.type.startsWith('video/'));
  }
  filterDocuments(materials: Material[]) {
    return materials.filter(material =>
      material.type === 'application/pdf' ||
      material.type.includes('ms') ||
      material.type.includes('officedocument') ||
      material.type === 'text/plain'
    );
  }

}