import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConferanceService } from '../services/conferance';
import { Conferance } from '../models/conferance';

@Component({
  selector: 'app-add-coferance',
  imports: [ReactiveFormsModule],
  templateUrl: './add-coferance.html',
  styleUrl: './add-coferance.css',
})
export class AddCoferance {
  private fb = inject(FormBuilder);
  private conferenceService = inject(ConferanceService);
  private router = inject(Router);

  errorMessage = signal('');

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

  onSubmit(): void {
    if (this.conferenceForm.invalid) {
      this.conferenceForm.markAllAsTouched();
      return;
    }

    const newConference: Conferance = {
      ...this.conferenceForm.value,
    };

    this.conferenceService.addConferance(newConference).subscribe({
      next: () => this.router.navigate(['/list']),
      error: (err) => {
        console.error('Error adding conference:', err);
        this.errorMessage.set('Failed to create conference. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}
