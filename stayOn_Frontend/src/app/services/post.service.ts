import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostUpdate } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private myAppUrl: string
  private myApiUrl: string

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/'
    this.myApiUrl = 'api/post'
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  getPostByUser(userId: number): Observable<Post> {
    return this.http.get<Post>(`${this.myAppUrl}${this.myApiUrl}/user/${userId}`)
  }

  getPostByUserPreferences(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.myAppUrl}${this.myApiUrl}/preferences/${userId}`)
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

  createPost(formData: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, formData)
  }

  updatePost(id: number, post: PostUpdate): Observable<PostUpdate> {
    return this.http.put<PostUpdate>(`${this.myAppUrl}${this.myApiUrl}/${id}`, post)
  }

}
