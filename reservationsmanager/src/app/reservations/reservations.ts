import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  title = 'ReservationManager';
  public reservations: Reservation[] = [];
  reservation: Reservation = {
    areaName: '',
    timeSlots: '',
    Booked: 0,
    imageName: ''
  };

  error = '';
  success = '';
  selectedFile: File | null = null;

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges();  // 🔄 force UI update
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm) {
    // Add logic if needed
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
