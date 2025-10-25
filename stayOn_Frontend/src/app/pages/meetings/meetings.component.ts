import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MeetingService } from '../../services/meeting.service';
import { Meeting } from '../../interfaces/meeting';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css'],
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[] = [];
  filtered: Meeting[] = [];
  searchControl = new FormControl('');

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.meetingService.getAllMeetings().subscribe({
      next: (data) => {
        // Adaptar User a user
        this.meetings = data.map((m) => ({
          ...m,
          user: m.user,
        }));
        this.filterMeetings();
      },
      error: (err) => console.error('Error al obtener reuniones:', err),
    });

    this.searchControl.valueChanges.subscribe(() => {
      this.filterMeetings();
    });
  }

  filterMeetings(): void {
    const term = this.searchControl.value?.trim().toLowerCase() || '';
    if (!term) {
      this.filtered = this.meetings;
      return;
    }
    this.filtered = this.meetings.filter(
      (meeting) =>
        meeting.title.toLowerCase().includes(term) ||
        meeting.description.toLowerCase().includes(term) ||
        meeting.url.toLowerCase().includes(term)
    );
  }
}
