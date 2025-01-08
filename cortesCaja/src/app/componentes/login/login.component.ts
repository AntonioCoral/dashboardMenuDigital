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
          const { token, role, isDelivery, company } = response;
  
          // Guarda el token y el companyId
          this.authService.saveToken(token);
          this.authService.saveCompanyId(company);
  
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
          this.toastr.error(err.error?.message || 'Credenciales inválidas');
        },
      });
    } else {
      this.toastr.error('Por favor, completa todos los campos.');
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
