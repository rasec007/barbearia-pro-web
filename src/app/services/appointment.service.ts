import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { environment } from '../../environments/environment';

export interface Appointment {
    id?: number;
    clientId: number;
    client?: Client;
    dateTime: string;
    durationMinutes: number;
    subject: string;
    status: string;
    observations?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/appointments`;

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }

    getCalendar(year: number, month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/Calendar/${year}/${month}`);
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, appointment);
    }

    updateAppointment(id: number, appointment: Appointment): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, appointment);
    }

    deleteAppointment(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
