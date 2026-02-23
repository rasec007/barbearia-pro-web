import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, Client } from '../../services/client.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
    clientService = inject(ClientService);
    toastService = inject(ToastService);
    cdr = inject(ChangeDetectorRef);

    clients: Client[] = [];
    filteredClients: Client[] = [];
    searchTerm = '';
    showModal = false;
    isSaving = false;

    eClient: Client = { name: '', phone: '' };

    ngOnInit() {
        this.loadClients();
    }

    loadClients() {
        this.clientService.getClients().subscribe({
            next: (data) => {
                this.clients = data;
                this.applyFilter();
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading clients:', err);
                this.toastService.error('Erro ao carregar lista de clientes.');
            }
        });
    }

    applyFilter() {
        this.filteredClients = this.clients.filter(c => {
            const nameMatch = c.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false;
            const phoneMatch = c.phone?.includes(this.searchTerm) ?? false;
            return nameMatch || phoneMatch;
        });
        this.cdr.detectChanges();
    }

    openModal(client?: Client) {
        if (client) {
            this.eClient = { ...client };
        } else {
            this.eClient = { name: '', phone: '', email: '', serviceType: '', address: '', notes: '' };
        }
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveClient() {
        if (this.isSaving) return;
        this.isSaving = true;

        const request = this.eClient.id
            ? this.clientService.updateClient(this.eClient.id, this.eClient)
            : this.clientService.createClient(this.eClient);

        request.subscribe({
            next: () => {
                this.closeModal(); // Close first
                this.loadClients();
                this.isSaving = false;
                this.toastService.success(this.eClient.id ? 'Cliente atualizado!' : 'Cliente cadastrado com sucesso!');
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao salvar cliente:', err);
                this.toastService.error('Erro ao salvar informações do cliente.');
                this.isSaving = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteClient(id: number) {
        if (confirm('Deseja realmente excluir este cliente?')) {
            this.clientService.deleteClient(id).subscribe({
                next: () => {
                    this.loadClients();
                    this.toastService.success('Cliente removido.');
                },
                error: () => this.toastService.error('Erro ao excluir cliente.')
            });
        }
    }

    getWhatsAppLink(phone: string) {
        const cleanPhone = phone?.replace(/\D/g, '') || '';
        return `https://wa.me/55${cleanPhone}`;
    }
}
