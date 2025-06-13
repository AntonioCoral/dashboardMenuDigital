import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;
  renewalMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      isDelivery: ['false', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        const { token, role, isDelivery, company, showRenewalNotice } = response;

        this.authService.saveToken(token);
        this.authService.saveCompanyId(company);

        if (showRenewalNotice) {
          this.toastr.warning('Tu suscripción ha vencido. Redirigiendo a la página de pago...', 'Renovación requerida');
          this.router.navigate(['/pago']); // 👈 asegúrate de tener esta ruta definida
          return; // 👈 para evitar que avance al panel
        }
        if (role === 'admin') {
          this.toastr.success('Bienvenido, Admin');
          this.router.navigate(['/list-orders']);
        } else if (isDelivery) {
          this.toastr.success(`Bienvenido, Repartidor ${username}`);
          this.router.navigate(['/delivery-orders', username]);
        } else {
          this.toastr.error('Rol no permitido');
        }
      },
      error: (err) => {
      const msg = err.error?.message || 'Credenciales inválidas';
      if (msg.includes('Realiza tu pago')) {
        this.toastr.warning(msg);
        setTimeout(() => {
          this.router.navigate(['/pago']);
        }, 2000);
      } else {
        this.toastr.error(msg);
      }
    }

    });
  } else {
    this.toastr.error('Por favor, completa todos los campos.');
  }
}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
