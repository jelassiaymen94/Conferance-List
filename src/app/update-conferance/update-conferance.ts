import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConferanceService } from '../services/conferance';
import { Conferance } from '../models/conferance';

@Component({
  selector: 'app-update-conferance',
  imports: [ReactiveFormsModule],
  templateUrl: './update-conferance.html',
  styleUrl: './update-conferance.css',
})
export class UpdateConferance implements OnInit {
  // Directly bound from route param /update/:id via withComponentInputBinding()
  id = input.required<string>();

  private fb = inject(FormBuilder);
  private conferenceService = inject(ConferanceService);
  private router = inject(Router);

  currentConference?: Conferance;
  isLoading = signal(true);
  errorMessage = signal('');

  get conferenceId(): number {
    return Number(this.id());
  }

  conferenceForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    time: [''],
    location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    imageUrl: [''],
  });

  get name() {
    return this.conferenceForm.get('name');
  }

  get date() {
    return this.conferenceForm.get('date');
  }

  get location() {
    return this.conferenceForm.get('location');
  }

  get price() {
    return this.conferenceForm.get('price');
  }

  ngOnInit(): void {
    if (isNaN(this.conferenceId)) {
      this.errorMessage.set('Invalid conference ID');
      this.isLoading.set(false);
      return;
    }

    this.conferenceService.getById(this.conferenceId).subscribe({
      next: (conf) => {
        this.currentConference = conf;
        this.conferenceForm.patchValue({
          name: conf.name || conf.title || '',
          date: conf.date || '',
          time: conf.time || '',
          location: conf.location || conf.place || '',
          price: conf.price ?? 0,
          description: conf.description || '',
          imageUrl: conf.imageUrl || '',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching conference:', err);
        this.errorMessage.set('Conference not found');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.conferenceForm.invalid) {
      this.conferenceForm.markAllAsTouched();
      return;
    }

    const updatedData: Conferance = {
      ...this.currentConference,
      ...this.conferenceForm.value,
      id: this.conferenceId,
    };

    this.conferenceService.updateConferance(this.conferenceId, updatedData).subscribe({
      next: () => this.router.navigate(['/list']),
      error: (err) => {
        console.error('Error updating conference:', err);
        this.errorMessage.set('Failed to update conference. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
