import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Post } from '../../interfaces/post';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../interfaces/comment';
import { Material } from '../../interfaces/material';

@Component({
  selector: 'app-post',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

  id: number = 0
  post: Post = {} as Post
  commentForm: FormGroup
  editingCommentId: number | null = null;
  editedMessage: string = '';
  currentUserId: number | null = null;

  constructor(private router: Router, private aRouter: ActivatedRoute, private _postService: PostService, private _commentService: CommentService) {
    this.id = Number(this.aRouter.snapshot.paramMap.get('id')!)
    this.commentForm = new FormGroup({
      message: new FormControl('', Validators.required)
    })
    this.currentUserId = Number(localStorage.getItem('id') || '0');
  }

  ngOnInit(): void {
    this.getPost()
  }

  getPost() {
    this._postService.getPostById(this.id).subscribe({
      next: (data) => {
        this.post = data
        this.post.Comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
          console.error('Post not found', e);
        } else {
          console.error('An error occurred while retrieving post', e);
        }
      }
    })
  }

  createComment() {
    if (this.commentForm.valid) {
      const newComment: Omit<Comment, 'id' | 'date'> = {
        message: this.commentForm.value.message,
        userId: Number(localStorage.getItem('id')),
        postId: this.id
      } as Omit<Comment, 'id'>;

      this._commentService.createComment(newComment).subscribe({
        next: (data) => {
          Swal.fire({
            icon: 'success',
            title: 'Comment created successfully',
            showConfirmButton: false,
            timer: 2000
          });
          this.commentForm.reset();
          this.post.Comments.unshift(data);
        },
        error: (e: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create comment',
            footer: e.message,
            showConfirmButton: false,
            timer: 4000
          });
        }
      });
    }
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

  // New method to delete a comment
  deleteComment(commentId: number) {
    const currentUserId = Number(localStorage.getItem('id'));  // Assuming user ID is stored here
    const comment = this.post.Comments.find(c => c.id === commentId);
    if (comment && comment.userId === currentUserId) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this._commentService.deleteComment(commentId).subscribe({
            next: () => {
              this.post.Comments = this.post.Comments.filter(c => c.id !== commentId);
              Swal.fire('Eliminado!', 'El comentario ha sido eliminado.', 'success');
            },
            error: (e: HttpErrorResponse) => {
              Swal.fire('Error', 'No se pudo eliminar el comentario.', 'error');
            }
          });
        }
      });
    } else {
      Swal.fire('Error', 'No puedes eliminar este comentario.', 'error');
    }
  }

  // New method to start editing a comment
  startEditComment(comment: Comment) {
    const currentUserId = Number(localStorage.getItem('id'));
    if (comment.userId === currentUserId) {
      this.editingCommentId = comment.id;
      this.editedMessage = comment.message;  // Load current message into temp variable
    } else {
      Swal.fire('Error', 'No puedes editar este comentario.', 'error');
    }
  }

  // New method to save the edited comment
  saveEditComment(commentId: number) {
    if (this.editedMessage.trim() !== '') {
      const updatedComment: Partial<Comment> = { message: this.editedMessage };
      this._commentService.updateComment(commentId, updatedComment).subscribe({
        next: (updatedData: Comment) => {
          const index = this.post.Comments.findIndex(c => c.id === commentId);
          if (index !== -1) {
            this.post.Comments[index] = { ...this.post.Comments[index], ...updatedData };
          }
          this.editingCommentId = null;
          Swal.fire('Editado', 'El comentario ha sido actualizado.', 'success');
        },
        error: (e: HttpErrorResponse) => {
          Swal.fire('Error', 'No se pudo actualizar el comentario.', 'error');
        }
      });
    }
  }

  // New method to cancel editing
  cancelEdit() {
    this.editingCommentId = null;
    this.editedMessage = '';
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
