import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConferanceService } from '../services/conferance';
import { Conferance } from '../models/conferance';

@Component({
  selector: 'app-conferance-list',
  imports: [RouterLink],
  templateUrl: './conferance-list.html',
  styleUrl: './conferance-list.css',
})
export class ConferanceList implements OnInit {
  private conferenceService = inject(ConferanceService);

  conferances = signal<Conferance[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.isLoading.set(true);
    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferances.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading conferences:', err);
        this.isLoading.set(false);
      },
    });
  }

  deleteConference(id?: number): void {
    if (!id || !confirm('Are you sure you want to delete this conference?')) return;

    this.conferenceService.deleteConferance(id).subscribe({
      next: () => this.conferances.update((list) => list.filter((c) => c.id !== id)),
      error: (err) => console.error('Error deleting conference:', err),
    });
  }
}
