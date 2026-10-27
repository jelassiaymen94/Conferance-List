import { Component, OnInit, input, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConferanceService } from '../services/conferance';
import { Conferance } from '../models/conferance';

@Component({
  selector: 'app-conferance-details',
  imports: [RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails implements OnInit {
  // Bound directly from route parameter /details/:id via withComponentInputBinding()
  id = input.required<string>();

  conference = signal<Conferance | undefined>(undefined);
  isLoading = signal(true);
  errorMessage = signal('');

  private conferenceService = inject(ConferanceService);
  private router = inject(Router);

  ngOnInit(): void {
    const numericId = Number(this.id());

    this.conferenceService.getById(numericId).subscribe({
      next: (data) => {
        this.conference.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching conference:', err);
        this.errorMessage.set('Conference not found');
        this.isLoading.set(false);
      },
    });
  }

  deleteConference(): void {
    const conf = this.conference();
    if (!conf?.id || !confirm('Are you sure you want to delete this conference?')) return;

    this.conferenceService.deleteConferance(conf.id).subscribe({
      next: () => this.router.navigate(['/list']),
      error: (err) => console.error('Error deleting conference:', err),
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
