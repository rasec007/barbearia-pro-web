import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;
    private storageKey = 'barber_user';

    // Initialize signal with data from localStorage if available
    currentUser = signal<any>(this.getUserFromStorage());

    private getUserFromStorage(): any {
        const savedUser = localStorage.getItem(this.storageKey);
        return savedUser ? JSON.parse(savedUser) : null;
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(user => {
                this.currentUser.set(user);
                localStorage.setItem(this.storageKey, JSON.stringify(user));
            })
        );
    }

    register(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, userData);
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem(this.storageKey);
    }

    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }
}
