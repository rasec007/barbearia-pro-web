import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    authService = inject(AuthService);
    router = inject(Router);
    toastService = inject(ToastService);

    email = '';
    password = '';
    error = '';
    loading = false;

    onSubmit() {
        this.loading = true;
        this.error = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (user) => {
                this.toastService.success(`Bem-vindo, ${user.name || 'Barbeiro'}!`);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.error = 'E-mail ou senha incorretos.';
                this.loading = false;
            }
        });
    }
}
