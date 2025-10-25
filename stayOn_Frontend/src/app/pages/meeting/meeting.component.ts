import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meeting } from '../../interfaces/meeting';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting',
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  meetingForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+/),
    ]),
    fechaReunion: new FormControl('', Validators.required),
  });

  meetings: Meeting[] = [];
  searchTerm: string = '';

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.getMyMeetings();
  }

  getMyMeetings(): void {
    const userId = localStorage.getItem('id');
    if (!userId) return;
    this.meetingService.getMeetingsByUser(+userId).subscribe({
      next: (data) => (this.meetings = data),
      error: (err) => console.error('Error al obtener reuniones:', err),
    });
  }

  createMeeting(): void {
    if (this.meetingForm.invalid) return;
    const userId = localStorage.getItem('id');
    if (!userId) return;

    const meetingToCreate: Partial<Meeting> = {
      title: this.meetingForm.value.title ?? '',
      description: this.meetingForm.value.description ?? '',
      url: this.meetingForm.value.url ?? '',
      fechaReunion: this.meetingForm.value.fechaReunion ?? '',
      userId: +userId,
    };

    this.meetingService.createMeeting(meetingToCreate).subscribe({
      next: (created) => {
        this.meetings.push(created);
        this.meetingForm.reset();
      },
      error: (err) => console.error('Error al crear reunión:', err),
    });
  }

  filteredMeetings(): Meeting[] {
    if (!this.searchTerm.trim()) return this.meetings;
    return this.meetings.filter((meeting) =>
      meeting.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
