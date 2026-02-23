import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { ClientService, Client } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
    appointmentService = inject(AppointmentService);
    clientService = inject(ClientService);
    toastService = inject(ToastService);
    cdr = inject(ChangeDetectorRef);

    currentDate = new Date();
    daysInMonth: { day: number, appointments: any[] }[] = [];
    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    clients: Client[] = [];
    showModal = false;
    isSaving = false;
    editingAppointment: Appointment = { clientId: 0, dateTime: '', durationMinutes: 60, subject: '', status: 'agendado' };

    ngOnInit() {
        this.loadData();
        this.clientService.getClients().subscribe({
            next: (data) => {
                this.clients = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar clientes:', err);
                this.toastService.error('Erro ao carregar lista de clientes.');
            }
        });
    }

    loadData() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;

        this.appointmentService.getCalendar(year, month).subscribe({
            next: (data) => {
                this.generateCalendar(year, month - 1, data);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading calendar:', err);
                this.toastService.error('Erro ao carregar dados do calendário.');
            }
        });
    }

    generateCalendar(year: number, month: number, appointments: any[]) {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        this.daysInMonth = [];

        for (let i = 0; i < firstDay; i++) {
            this.daysInMonth.push({ day: 0, appointments: [] });
        }

        for (let d = 1; d <= lastDate; d++) {
            const dayApps = appointments.filter(a => {
                if (!a.dateTime) return false;
                const appDate = new Date(a.dateTime);
                return appDate.getDate() === d;
            });
            this.daysInMonth.push({ day: d, appointments: dayApps });
        }
    }

    onPrevMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.loadData();
    }

    onNextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.loadData();
    }

    openNewAppointment(day: number) {
        if (this.clients.length === 0) {
            this.toastService.warning('Você precisa cadastrar pelo menos um cliente para fazer agendamentos.');
            return;
        }

        const now = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day, 9, 0);
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const dNum = String(now.getDate()).padStart(2, '0');
        const localFormatted = `${y}-${m}-${dNum}T09:00`;

        this.editingAppointment = {
            clientId: this.clients[0]?.id || 0,
            dateTime: localFormatted,
            durationMinutes: 60,
            subject: '',
            status: 'agendado'
        };
        this.showModal = true;
        this.cdr.detectChanges();
    }

    saveAppointment() {
        if (this.isSaving) return;

        const cid = Number(this.editingAppointment.clientId);
        if (!cid || cid <= 0) {
            this.toastService.warning('Por favor, selecione um cliente válido.');
            return;
        }

        if (!this.editingAppointment.dateTime) {
            this.toastService.warning('Por favor, selecione a data e o horário.');
            return;
        }

        this.isSaving = true;
        this.cdr.detectChanges();

        const payload: Appointment = {
            clientId: cid,
            dateTime: this.editingAppointment.dateTime,
            durationMinutes: Number(this.editingAppointment.durationMinutes) || 60,
            subject: this.editingAppointment.subject || 'Corte',
            status: this.editingAppointment.status || 'agendado'
        };

        this.appointmentService.createAppointment(payload).subscribe({
            next: () => {
                this.showModal = false;
                this.isSaving = false;
                this.loadData();
                this.toastService.success('Agendamento salvo com sucesso!');
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro detalhado:', err);
                let msg = 'Erro ao salvar agendamento.';
                if (err.status === 400) msg += ' Dados inválidos (400).';
                if (err.status === 500) msg += ' Erro interno do servidor (500).';

                this.toastService.error(msg);
                this.isSaving = false;
                this.cdr.detectChanges();
            }
        });
    }
}
