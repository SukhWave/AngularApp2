import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { Auth } from '../services/auth';

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
  userName = '';
  selectedFile: File | null = null;

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public authService: Auth
  ) {}

  ngOnInit(): void {
    this.getReservations();
    this.userName = localStorage.getItem('username') || 'Guest';
    this.cdr.detectChanges();
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
        console.log('Reservations loaded:', this.reservations);
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

    if (this.selectedFile) {
      this.reservation.imageName = this.selectedFile.name;
      this.uploadFile(); // Upload before saving reservation
    } else {
      this.reservation.imageName = 'placeholder_100.jpg'; // fallback
    }

    this.reservationService.add(this.reservation).subscribe({
      next: (res: Reservation) => {
        this.reservations.push(res);
        this.success = 'Reservation added successfully';
        f.resetForm();
        this.selectedFile = null;
        this.reservation = {
          areaName: '',
          timeSlots: '',
          Booked: 0,
          imageName: ''
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to add reservation:', err);
        this.error = 'Failed to add reservation.';
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
        this.success = 'Reservation updated successfully.';
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Failed to update reservation.';
        console.error(err);
      }
    });
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/angularapp2/reservationsapi/upload.php', formData)
      .subscribe({
        next: res => console.log('File uploaded successfully:', res),
        error: err => console.error('File upload failed:', err)
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
