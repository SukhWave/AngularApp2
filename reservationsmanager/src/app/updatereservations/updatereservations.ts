import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-updatereservations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './updatereservations.html',
  styleUrls: ['./updatereservations.css'],
  providers: [ReservationService]
})
export class Updatereservations implements OnInit {
  bookingID!: number;
  reservation: Reservation = {
    areaName: '',
    timeSlots: '',
    Booked: 0,
    imageName: ''
  };

  success = '';
  error = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalImageName: string = '';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bookingID = +this.route.snapshot.paramMap.get('id')!;
    this.reservationService.get(this.bookingID).subscribe({
      next: (data: Reservation) => {
        this.reservation = data;
        this.originalImageName = data.imageName || '';
        this.previewUrl = `http://localhost/angularapp2/reservationsapi/uploads/${this.originalImageName}`;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error loading reservation.'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateReservation(form: NgForm): void {
    if (form.invalid) return;

    const formData = new FormData();
    formData.append('bookingID', this.bookingID.toString());
    formData.append('areaName', this.reservation.areaName || '');
    formData.append('timeSlots', this.reservation.timeSlots || '');
    formData.append('Booked', String(this.reservation.Booked));
    formData.append('imageName', this.reservation.imageName || '');
    formData.append('oldImageName', this.originalImageName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post('http://localhost/angularapp2/reservationsapi/edit.php', formData).subscribe({
      next: () => {
        this.success = 'Reservation updated successfully';
        this.router.navigate(['/reservations']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.error = err.error?.error || 'Duplicate reservation detected';
        } else {
          this.error = 'Update failed';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
