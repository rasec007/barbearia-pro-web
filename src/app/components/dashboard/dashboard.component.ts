import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    appointmentService = inject(AppointmentService);
    clientService = inject(ClientService);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    stats = {
        totalClients: 0,
        todayAppointments: 0,
        pendingConfirmations: 0
    };

    todayAppointments: any[] = [];
    allClients: any[] = [];

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const today = new Date();
        forkJoin({
            clients: this.clientService.getClients(),
            appointments: this.appointmentService.getAppointments()
        }).subscribe({
            next: ({ clients, appointments }) => {
                this.stats.totalClients = clients.length;
                this.allClients = clients.slice(0, 5);

                this.todayAppointments = appointments.filter(a => {
                    const appDate = new Date(a.dateTime);
                    return appDate.toDateString() === today.toDateString();
                });

                this.stats.todayAppointments = this.todayAppointments.length;
                this.stats.pendingConfirmations = appointments.filter(a => a.status === 'agendado').length;

                this.cdr.detectChanges();
            },
            error: (err) => console.error('Dashboard load error:', err)
        });
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}
