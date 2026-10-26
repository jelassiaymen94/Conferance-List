import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  conferances = signal<Conferance[]>([]);
  isLoading = signal(true);

  conferenceService = inject(ConferanceService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.isLoading.set(true);
    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferances.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading conferences:', err);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  deleteConference(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this conference?')) {
      this.conferenceService.deleteConferance(id).subscribe({
        next: () => {
          this.conferances.update((list) => list.filter((conf) => conf.id !== id));
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error deleting conference:', err);
        },
      });
    }
  }
}
