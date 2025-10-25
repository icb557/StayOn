import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../../interfaces/topic';
import { Preference, UserPreferences } from '../../interfaces/preference';
import { TopicService } from '../../services/topic.service';
import { PreferenceService } from '../../services/preference.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  topics: Topic[] = [];
  userPreferences: UserPreferences | null = null;
  selectedTopicIds: Set<number> = new Set();
  userId: number = 0;
  loading: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    
    // Get userId from route params
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadData();
    });
  }
  
  // Helper method for template to display selected topic IDs
  getSelectedTopicIdsString(): string {
    return Array.from(this.selectedTopicIds).join(', ');
  }

  // Load both topics and user preferences in parallel
  loadData(): void {
    forkJoin({
      topics: this.topicService.getTopics(),
      preferences: this.preferenceService.getUserPreferences(this.userId)
    }).subscribe({
      next: (result) => {
        this.topics = result.topics;
        this.userPreferences = result.preferences;
        
        // Extract selected topic IDs from the response
        this.extractSelectedTopicIds();
        
        this.sortTopics();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  // Extract topic IDs from the API response, handling different possible formats
  extractSelectedTopicIds(): void {
    this.selectedTopicIds.clear();
    
    if (!this.userPreferences) {
      return;
    }
    
    // Direct check for the format shown in the debug info: { "Topics": [ { "id": 1, "name": "..." } ] }
    try {
      const rawJson = JSON.stringify(this.userPreferences);
      
      // Try to extract IDs directly from the JSON string using regex
      const idMatches = rawJson.match(/"id"\s*:\s*(\d+)/g);
      if (idMatches && idMatches.length > 0) {
        idMatches.forEach(match => {
          const idStr = match.match(/\d+/);
          if (idStr) {
            const id = parseInt(idStr[0], 10);
            if (!isNaN(id)) {
              this.selectedTopicIds.add(id);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error during direct JSON parsing:', error);
    }
    
    try {
      // Special case for the format shown in the debug info with "Topics" array
      const rawPrefs = this.userPreferences as any;
      if ('Topics' in rawPrefs && Array.isArray(rawPrefs.Topics)) {
        rawPrefs.Topics.forEach((topic: any) => {
          if (topic && typeof topic.id === 'number') {
            this.selectedTopicIds.add(topic.id);
          }
        });
      }
      
      // Check for nested structure like { "Topic": [ { "id": 1, "name": "..." }, ... ] }
      if (rawPrefs && typeof rawPrefs === 'object') {
        for (const key in rawPrefs) {
          if (key === 'Topic' || key === 'Topics') {
            const topics = rawPrefs[key];
            if (Array.isArray(topics)) {
              topics.forEach((topic: any) => {
                if (topic && typeof topic.id === 'number') {
                  this.selectedTopicIds.add(topic.id);
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing special format:', error);
    }
    
    // Handle format: { userId, Topic: [{id, name}] }
    if (this.userPreferences.Topic && Array.isArray(this.userPreferences.Topic)) {
      this.userPreferences.Topic.forEach(topic => {
        if (topic && typeof topic.id === 'number') {
          this.selectedTopicIds.add(topic.id);
        }
      });
    }
    
    // Handle format: { userId, topics: [{id, name}] }
    else if (this.userPreferences.topics && Array.isArray(this.userPreferences.topics)) {
      this.userPreferences.topics.forEach(topic => {
        if (topic && typeof topic.id === 'number') {
          this.selectedTopicIds.add(topic.id);
        }
      });
    }
    
    // Handle format: { userId, preferences: [{topicId, userId, Topic?}] }
    else if (this.userPreferences.preferences && Array.isArray(this.userPreferences.preferences)) {
      this.userPreferences.preferences.forEach(pref => {
        if (pref.topicId) {
          this.selectedTopicIds.add(pref.topicId);
        } else if (pref.Topic && pref.Topic.id) {
          this.selectedTopicIds.add(pref.Topic.id);
        }
      });
    }
    
    // If we still don't have any selected topics, try to parse the raw response
    if (this.selectedTopicIds.size === 0) {
      try {
        const rawResponse = this.userPreferences as any;
        
        // Try to find any property that might contain topic IDs
        Object.keys(rawResponse).forEach(key => {
          const value = rawResponse[key];
          if (Array.isArray(value)) {
            value.forEach((item: any) => {
              if (item && typeof item === 'object') {
                if ('id' in item && typeof item.id === 'number') {
                  this.selectedTopicIds.add(item.id);
                } else if ('topicId' in item && typeof item.topicId === 'number') {
                  this.selectedTopicIds.add(item.topicId);
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('Error parsing raw response:', error);
      }
    }
  }

  // Sort topics to show selected ones at the beginning
  sortTopics(): void {
    if (!this.topics || this.topics.length === 0) {
      return;
    }
    
    // Sort the topics array to have selected topics at the beginning
    this.topics.sort((a, b) => {
      const aSelected = this.selectedTopicIds.has(a.id);
      const bSelected = this.selectedTopicIds.has(b.id);
      
      if (aSelected && !bSelected) {
        return -1; // a comes before b
      } else if (!aSelected && bSelected) {
        return 1; // b comes before a
      }
      
      // If both are selected or both are not selected, maintain original order
      return a.id - b.id;
    });
  }

  isTopicSelected(topicId: number): boolean {
    return this.selectedTopicIds.has(topicId);
  }

  togglePreference(topic: Topic): void {
    const isSelected = this.isTopicSelected(topic.id);
    
    if (isSelected) {
      // Remove preference
      this.preferenceService.deleteUserPreference(this.userId, topic.id).subscribe({
        next: () => {
          // Remove from selected IDs
          this.selectedTopicIds.delete(topic.id);
          
          // Update userPreferences object if it exists in the expected format
          if (this.userPreferences && this.userPreferences.Topic) {
            this.userPreferences.Topic = this.userPreferences.Topic.filter(t => t.id !== topic.id);
          }
          
          this.sortTopics(); // Re-sort topics after removing preference
        },
        error: (error: any) => {
          console.error('Error al eliminar la preferencia', error);
        }
      });
    } else {
      // Add preference
      const newPreference: Preference = {
        userId: this.userId,
        topicId: topic.id
      };
      
      this.preferenceService.createPreference(newPreference).subscribe({
        next: () => {
          // Add to selected IDs
          this.selectedTopicIds.add(topic.id);
          
          // Update userPreferences object if it exists
          if (this.userPreferences) {
            if (this.userPreferences.Topic) {
              this.userPreferences.Topic.push({ id: topic.id, name: topic.name });
            } else {
              this.userPreferences.Topic = [{ id: topic.id, name: topic.name }];
            }
          } else {
            this.userPreferences = {
              userId: this.userId,
              Topic: [{ id: topic.id, name: topic.name }]
            };
          }
          
          this.sortTopics(); // Re-sort topics after adding preference
        },
        error: (error: any) => {
          console.error('Error al agregar la preferencia', error);
        }
      });
    }
  }
} 