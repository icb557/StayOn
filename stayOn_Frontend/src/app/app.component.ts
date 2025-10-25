import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stayOn_Frontend';
  navbar: boolean = true;
  hiddenRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.navbar = !this.hiddenRoutes.some(route => event.url.startsWith(route));
      }
    });
  }

}
