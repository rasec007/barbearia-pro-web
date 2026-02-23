import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Client {
    id?: number;
    name: string;
    photoUrl?: string;
    email?: string;
    phone: string;
    address?: string;
    serviceType?: string;
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/clients`;

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.apiUrl);
    }

    getClient(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    updateClient(id: number, client: Client): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, client);
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
