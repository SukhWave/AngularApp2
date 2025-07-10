import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
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

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }

  getReservations(): void {
    this.resetAlerts();

    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'Successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges();
      },
      (err) => {
        console.error(err);
        this.error = 'Error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm): void {
    this.resetAlerts();

    if (f.invalid) {
      return;
    }

    this.reservation.imageName = this.selectedFile
      ? this.selectedFile.name
      : 'placeholder_100.jpg';

    this.reservationService.add(this.reservation).subscribe({
      next: (res) => {
        alert('Reservation added successfully!');
        this.getReservations();
        f.resetForm();
        this.reservation = {
          areaName: '',
          timeSlots: '',
          Booked: 0,
          imageName: ''
        };
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Failed to add reservation:', err);
        alert('Failed to add reservation.');
      }
    });
  }

  editReservation(areaName: any, timeSlots: any, booked: boolean, bookingID: number): void {
    this.resetAlerts();

    const updatedReservation = {
      bookingID: bookingID,
      areaName: areaName.value,
      timeSlots: timeSlots.value,
      Booked: booked ? 1 : 0
    };

    this.http.put<any>(
      'http://localhost/angularapp2/reservationsapi/edit.php',
      { data: updatedReservation }
    ).subscribe({
      next: () => {
        alert('Reservation updated successfully.');
      },
      error: err => {
        alert('Failed to update reservation.');
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;
    }
  }
}
