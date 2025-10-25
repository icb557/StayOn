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

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomeComponent,
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
  },
  {
    title: 'profile',
    path: 'profile/:userId',
    component: ProfileComponent,
  },
  {
    title: 'search',
    path: 'search',
    component: SearchComponent,
  },
  {
    title: 'meeting',
    path: 'meeting',
    component: MeetingComponent,
  },
  {
    title: 'meettings',
    path: 'meetings',
    component: MeetingsComponent,
  },
  {
    title: 'topic',
    path: 'topic/:id',
    component: TopicComponent,
  },
  {
    title: 'about-support',
    path: 'about-support',
    component: AboutSupportComponent,
  },
  {
    title: 'preferences',
    path: 'preferences/:userId',
    component: PreferencesComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
