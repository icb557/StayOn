import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../interfaces/profile';


@Injectable({
  providedIn: 'root'
})
export class Profileservice {

  private myAppUrl: string
  private myApiUrl: string

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/'
    this.myApiUrl = 'api/profile'
  }

  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.myAppUrl}${this.myApiUrl}/${userId}`)
  }
}