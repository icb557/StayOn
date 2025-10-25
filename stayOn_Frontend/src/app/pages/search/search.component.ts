import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../interfaces/topic';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  users: User[] = [];
  filteredUsers: User[] = [];
  topics: Topic[] = []
  filteredTopics: Topic[] = [];
  query = ''
  constructor(private _userService: UserService, private _topicService: TopicService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getTopics();
  }

  getUsers() {
    this._userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = this.getfilteredUsers()
    });
  }

  getfilteredUsers(): User[] {
    const queryLower = this.query.toLowerCase();
    return this.users.filter(user => {
      const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName} ${user.secondLastName || ''}`.toLowerCase();
      return fullName.includes(queryLower);
    });
  }

  getTopics() {
    this._topicService.getTopics().subscribe((data: Topic[]) => {
      this.topics = data;
      this.filteredTopics = this.getFilteredtopics();
      console.log(this.topics)
      console.log(this.filteredTopics)
    });
  }

  getFilteredtopics(): Topic[] {
    const queryLower = this.query.toLowerCase();
    return this.topics.filter(topic => topic.name.toLowerCase().includes(queryLower));
  }

  search() {
    this.filteredUsers = this.getfilteredUsers()
    this.filteredTopics = this.getFilteredtopics();
    console.log(this.filteredTopics)
  }

  viewUser(userId: number) {
    window.location.href = `/profile/${userId}`
  }

  viewTopic(topicId: number) {
    window.location.href = `/topic/${topicId}`;
  }

}
