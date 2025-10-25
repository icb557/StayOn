import { Component } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { Post } from '../../interfaces/post';
import { ActivatedRoute, Router } from '@angular/router';
import { Material } from '../../interfaces/material';

@Component({
  selector: 'app-topic',
  imports: [],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {
  id = 0
  posts: Post[] = [];
  topicName = '';
  constructor(private _topicService: TopicService, private aRouter: ActivatedRoute, private router: Router) {
    this.id = Number(this.aRouter.snapshot.paramMap.get('id')!);
  }
  ngOnInit(): void {
    this.getPostsByTopicId()
    this.getTopicName();
  }

  getPostsByTopicId() {
    this._topicService.getPostsByTopicId(this.id).subscribe({
      next: (data) => {
        this.posts = data;
        // console.log('Posts for topic:', this.posts);
      },
      error: (e) => {
        console.error('Error retrieving posts for topic', e);
      }
    });
  }

  getTopicName() {
    this._topicService.getTopicById(this.id).subscribe({
      next: (data) => {
        this.topicName = data.name;
        // console.log('Topic name:', this.topicName);
      },
      error: (e) => {
        console.error('Error retrieving topic name', e);
      }
    });
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const day = date.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${day} de ${month}, ${year} • ${time}`;
  }

  showProfile(id: number) {
    this.router.navigate([`/profile/${id}`])
  }

  filterImages(materials: Material[]) {
    return materials.filter(material => material.type.startsWith('image/'));
  }
  filterVideos(materials: Material[]) {
    return materials.filter(material => material.type.startsWith('video/'));
  }
  filterDocuments(materials: Material[]) {
    return materials.filter(material =>
      material.type === 'application/pdf' ||
      material.type.includes('ms') ||
      material.type.includes('officedocument') ||
      material.type === 'text/plain'
    );
  }
}