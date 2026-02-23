import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    id: number;
    text: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<ToastMessage[]>([]);
    private counter = 0;

    show(text: string, type: ToastType = 'success') {
        const id = ++this.counter;
        this.toasts.update(current => [...current, { id, text, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => this.remove(id), 3000);
    }

    success(text: string) { this.show(text, 'success'); }
    error(text: string) { this.show(text, 'error'); }
    warning(text: string) { this.show(text, 'warning'); }
    info(text: string) { this.show(text, 'info'); }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
