import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meeting } from '../interfaces/meeting';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private apiUrl = 'http://localhost:3000/api/meetings'; // cambia si tu backend usa otro puerto o ruta

  constructor(private http: HttpClient) {}

  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.apiUrl);
  }

  getMeeting(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`);
  }

  getMeetingsByUser(userId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/user/${userId}`);
  }

  createMeeting(meeting: Partial<Meeting>): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, meeting);
  }

  updateMeeting(id: number, meeting: Partial<Meeting>): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, meeting);
  }

  deleteMeeting(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
