import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preference, UserPreferences } from '../interfaces/preference';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/';
    this.myApiUrl = 'api/preference';
  }

  getAllPreferences(): Observable<Preference[]> {
    return this.http.get<Preference[]>(`${this.myAppUrl}api/preferences/`);
  }

  getUserPreferences(userId: number): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.myAppUrl}${this.myApiUrl}/user/${userId}`);
  }

  createPreference(preference: Preference): Observable<Preference> {
    return this.http.post<Preference>(`${this.myAppUrl}${this.myApiUrl}/`, preference);
  }

  deleteUserPreference(userId: number, topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/user/${userId}/topic/${topicId}`);
  }
} 