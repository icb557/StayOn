import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Post } from '../../interfaces/post';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Topic } from '../../interfaces/topic';
import { TopicService } from '../../services/topic.service';
import { Material } from '../../interfaces/material';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  posts: Post[] = []
  postsByUserPreferences: Post[] = []
  currentSlideIndex = 0;
  slides!: NodeListOf<Element>;
  userName = localStorage.getItem('firstName')!;
  userId = localStorage.getItem('id')!;
  topics: Topic[] = []

  publishForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private _postService: PostService, private _topicService: TopicService, private router: Router, private fb: FormBuilder) {
    this.publishForm = this.fb.group({
      message: ['', { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(500)] }],
      topicId: ['', { validators: [Validators.required] }],
    });
  }

  ngOnInit(): void {
    this.getPostByUserPreferences()
    this.getPost()
    this.slides = document.querySelectorAll('.carousel-slide');
    this.showSlide(this.currentSlideIndex);
    this.startCarousel();
    this.getTopics()
  }

  showProfile(id: number) {
    this.router.navigate([`/profile/${id}`])
  }

  startCarousel() {
    setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  showSlide(index: number) {
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.slides[index].classList.add('active');
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    this.showSlide(this.currentSlideIndex);
  }

  showPost(id: number) {
    this.router.navigate([`/post/${id}`])
  }

  getPostByUserPreferences() {
    this._postService.getPostByUserPreferences(Number(this.userId)).subscribe({
      next: (data) => {
        this.postsByUserPreferences = data
      }, error: (e: HttpErrorResponse) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error ocurred while retrieving post",
          footer: "Please try again later",
          showConfirmButton: false,
          timer: 4000
        });
        if (e.status === 404) {
          console.error('"No posts available."', e);
        } else {
          console.error('An error occurred while retrieving post', e);
        }
      }
    })
  }

  getPost() {
    this._postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data
      }, error: (e: HttpErrorResponse) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error ocurred while retrieving post",
          footer: "Please try again later",
          showConfirmButton: false,
          timer: 4000
        });
        if (e.status === 404) {
          console.error('"No posts available."', e);
        } else {
          console.error('An error occurred while retrieving post', e);
        }
      }
    })
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);

    const day = date.getDate();
    const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

    return `${day} de ${month}, ${year} • ${time}`;
  }
  user = ""
  searchUser() {
    if (this.user !== "") {
      window.location.href = `/search?query=${this.user}`
    }
  }

  getTopics() {
    this._topicService.getTopics().subscribe({
      next: (data) => {
        this.topics = data
      }, error: (e: HttpErrorResponse) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error ocurred while retrieving topics",
          footer: "Please try again later",
          showConfirmButton: false,
          timer: 4000
        });
        if (e.status === 404) {
          console.error('"No topics available."', e);
        } else {
          console.error('An error occurred while retrieving topics', e);
        }
      }
    })
  }

  onFileChange(event: any) {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    const selectedFiles: File[] = Array.from(event.target.files);
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select only valid files (images, videos, PDFs, Word, Excel, PowerPoint, or text files).',
        showConfirmButton: true
      });
      return;
    }

    this.selectedFiles = selectedFiles;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {

    if (this.publishForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill out the form correctly.',
        showConfirmButton: true
      });
      return;
    }

    const formData = new FormData();
    formData.append('message', this.publishForm.value.message);
    formData.append('topicId', this.publishForm.value.topicId);
    formData.append('userId', this.userId.toString());

    for (let file of this.selectedFiles) {
      formData.append('files', file);
    }

    this._postService.createPost(formData).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Post Published',
          text: 'Your post has been published successfully!',
          showConfirmButton: true
        });
        this.publishForm.reset();
        this.selectedFiles = [];
        this.getPost();
      },
      error: err => {
        console.error('Error al publicar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while publishing your post. Please try again later.',
          showConfirmButton: true
        });
      }
    });
  }

  getFileType(mimetype: string) {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (
      mimetype === 'application/pdf' ||
      mimetype.includes('ms') ||
      mimetype.includes('officedocument') ||
      mimetype === 'text/plain'
    ) return 'document';
    return 'other';
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