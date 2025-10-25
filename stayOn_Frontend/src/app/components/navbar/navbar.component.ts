import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [RouterModule]
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userId: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const name = localStorage.getItem('firstName');
    const userId = localStorage.getItem('id');
    if (name && userId) {
      this.userName = name;
      this.userId = +userId;
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToProfile(userId: number): void {
    this.router.navigate([`/profile/${userId}`]);
  }

  goToAboutSupport() {
    this.router.navigate(['/about-support']);
  }

  goToPreferences() {
    this.router.navigate([`/preferences/${this.userId}`]);
  }
}
