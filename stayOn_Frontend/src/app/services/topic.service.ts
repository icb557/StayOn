import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../interfaces/topic';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private myAppUrl: string
  private myApiUrl: string

  constructor(private http: HttpClient) {
    this.myAppUrl = 'http://localhost:3000/'
    this.myApiUrl = 'api/topic'
  }
  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.myAppUrl}${this.myApiUrl}`)
  }
  getTopicById(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }
  createTopic(name: string): Observable<Topic> {
    return this.http.post<Topic>(`${this.myAppUrl}${this.myApiUrl}`, { name })
  }
  updateTopic(topic: Topic): Observable<Topic> {
    return this.http.put<Topic>(`${this.myAppUrl}${this.myApiUrl}/${topic.id}`, topic)
  }

  getPostsByTopicId(topicId: number): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}/${topicId}/posts`)
  }
  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`)
  }

}
