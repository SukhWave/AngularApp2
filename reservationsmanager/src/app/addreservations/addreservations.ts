import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService]
})
export class Addreservations implements OnInit {
  reservation: Reservation = {
    areaName: '',
    timeSlots: '',
    Booked: 0,
    imageName: ''
  };

  selectedFile: File | null = null;
  error = '';
  success = '';

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  }

addReservation(f: NgForm): void {
  this.resetAlerts();

  // Default image if none selected
  if (!this.reservation.imageName) {
    this.reservation.imageName = 'placeholder_100.jpg';
  }

  this.reservationService.add(this.reservation).subscribe(
    (res: Reservation) => {
      this.success = 'Reservation successfully added.';

      // Upload image if one was selected
      if (this.selectedFile && this.reservation.imageName !== 'placeholder_100.jpg') {
        this.uploadFile();
      }

      f.reset();
      this.router.navigate(['/reservations']);
    },
    (err) => {
      if (err.status === 409) {
        this.error = 'This time slot is already booked for the selected area.';
      } else {
        this.error = err.error?.message || err.message || 'Error occurred while saving reservation.';
      }

      this.cdr.detectChanges();
    }
  );
}

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/reservationmanagerangular/api/upload', formData).subscribe(
      (response) => console.log('Image uploaded successfully:', response),
      (error) => console.error('Image upload failed:', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}

