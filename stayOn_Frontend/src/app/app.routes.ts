import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PostComponent } from './pages/post/post.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { TopicComponent } from './pages/topic/topic.component';
import { AboutSupportComponent } from './pages/about-support/about-support.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomeComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'login',
    path: 'login',
    component: LoginComponent,
  },
  {
    title: 'register',
    path: 'register',
    component: RegisterComponent,
  },
  {
    title: 'Forgot Password',
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    title: 'Reset Password',
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    title: 'post',
    path: 'post/:id',
    component: PostComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'profile',
    path: 'profile/:userId',
    component: ProfileComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'search',
    path: 'search',
    component: SearchComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'meeting',
    path: 'meeting',
    component: MeetingComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'meettings',
    path: 'meetings',
    component: MeetingsComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'topic',
    path: 'topic/:id',
    component: TopicComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'about-support',
    path: 'about-support',
    component: AboutSupportComponent,
    canActivate: [loginGuard],
  },
  {
    title: 'preferences',
    path: 'preferences/:userId',
    component: PreferencesComponent,
    canActivate: [loginGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
