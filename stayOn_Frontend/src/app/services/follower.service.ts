import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {
  private myAppUrl: string
  private myApiUrl: string

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/'
    this.myApiUrl = 'api/follower'
  }

  followUser(followerId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}/${userId}/follow`, { followerId });
  }
  unfollowUser(followerId: number, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}/${userId}/unfollow`, { body: { followerId } });
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/${userId}/followers`);
  }
  getFollowing(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/${userId}/following`);
  }
}
