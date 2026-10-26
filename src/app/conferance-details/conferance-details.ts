import { Component, OnInit, input, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferanceService } from '../services/conferance';
import { Conferance } from '../models/conferance';

@Component({
  selector: 'app-conferance-details',
  imports: [RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails implements OnInit {
  id = input.required<string>();
  conference = signal<Conferance | undefined>(undefined);
  isLoading = signal(true);
  errorMessage = signal('');

  private conferenceService = inject(ConferanceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const rawId = this.id() || this.route.snapshot.params['id'];
    const id = Number(rawId);

    this.conferenceService.getById(id).subscribe({
      next: (data) => {
        this.conference.set(data);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching conference:', err);
        this.errorMessage.set('Conference not found');
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  deleteConference(): void {
    const conf = this.conference();
    if (conf?.id && confirm('Are you sure you want to delete this conference?')) {
      this.conferenceService.deleteConferance(conf.id).subscribe({
        next: () => {
          this.router.navigate(['/list']);
        },
        error: (err) => {
          console.error('Error deleting conference:', err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
