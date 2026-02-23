import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
            <div *ngFor="let toast of toastService.toasts()" 
                 class="toast-item" 
                 [ngClass]="toast.type"
                 (click)="toastService.remove(toast.id)">
                <div class="toast-icon">
                    <span *ngIf="toast.type === 'success'">✅</span>
                    <span *ngIf="toast.type === 'error'">❌</span>
                    <span *ngIf="toast.type === 'warning'">⚠️</span>
                    <span *ngIf="toast.type === 'info'">ℹ️</span>
                </div>
                <div class="toast-content">
                    {{ toast.text }}
                </div>
                <button class="toast-close">&times;</button>
            </div>
        </div>
    `,
    styles: [`
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast-item {
            pointer-events: auto;
            min-width: 300px;
            max-width: 400px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            animation: slideIn 0.3s ease forwards;
            border-left: 5px solid #ccc;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .toast-item.success { border-left-color: #10b981; }
        .toast-item.error { border-left-color: #ef4444; }
        .toast-item.warning { border-left-color: #f59e0b; }
        .toast-item.info { border-left-color: #3b82f6; }

        .toast-icon {
            font-size: 20px;
            flex-shrink: 0;
        }

        .toast-content {
            flex-grow: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1e293b;
        }

        .toast-close {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
