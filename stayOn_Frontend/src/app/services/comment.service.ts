import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private myAppUrl: string = 'http://localhost:3000/';
  private myApiUrl: string = 'api/comment';

  constructor(private http: HttpClient) {}

  createComment(comment: Omit<Comment, 'id' | 'date'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.myAppUrl}${this.myApiUrl}`, comment);
  }

  public deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  public updateComment(id: number, updatedComment: Partial<Comment>): Observable<Comment> {
    return this.http.patch<Comment>(`${this.myAppUrl}${this.myApiUrl}/${id}`, updatedComment);
  }

  // Other methods can be added later if needed, based on your endpoints
} 