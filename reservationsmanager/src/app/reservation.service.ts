import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  baseUrl = 'http://localhost/angularapp2/reservationsapi';  

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.baseUrl}/list.php`).pipe(
      map((res: any) => res['data']) 
    );
  }

  add(reservation: Reservation) {
    return this.http.post(`${this.baseUrl}/add.php`, { data: reservation }).pipe(
      map((res: any) => res['data'])
    );
  }

  edit(reservation: Reservation) {
    return this.http.put(`${this.baseUrl}/edit.php`, { data: reservation });
  }

  delete(bookingID: number) {
    const params = new HttpParams().set('bookingID', bookingID.toString());
    return this.http.delete(`${this.baseUrl}/delete.php`, { params });
  }
}
