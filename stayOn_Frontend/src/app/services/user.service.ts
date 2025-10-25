import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/';
    this.myApiUrl = 'api/user';
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.myAppUrl}${this.myApiUrl}/${id}`,
      user
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/login`, {
      email,
      password,
    });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.myAppUrl}${this.myApiUrl}/request-password-reset`,
      { email }
    );
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.myAppUrl}${this.myApiUrl}/reset-password`,
      { token, newPassword }
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/`)
  }

}
