import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { AuthService } from '../service/auth'; // Asegúrate que la ruta sea correcta
import { User } from '../model/user'; // Asegúrate que la ruta sea correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login-register.html',
  styleUrl: './login-register.css',
})
export class LoginRegister implements OnInit { 
  
  // Variables para la interfaz
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;
  
  // Modelo para el formulario (usando las nuevas propiedades: username, idUser, isAdmin)
  user: User = { 
    idUser: undefined,             // Usando idUser
    username: '',          // Usando username
    email: '',
    password: '',
    isAdmin: false         // Usando isAdmin
  } as User; // Casteamos como User (aunque sea una clase o interfaz)

  // Inyección de dependencias usando 'inject'
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Si el usuario ya está logueado, redirigir al home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  // -----------------------------------------------------------------------
  // LÓGICA DE INTERFAZ
  // -----------------------------------------------------------------------

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null; // Limpiar errores al cambiar de modo
    this.resetForm();
  }

  resetForm() {
    // Reinicia el modelo con las nuevas propiedades
    this.user = { 
        idUser: undefined,
        username: '',
        email: '',
        password: '',
        isAdmin: false
    } as User;
  }
  
  // -----------------------------------------------------------------------
  // LÓGICA DE BACKEND / AUTHSERVICE
  // -----------------------------------------------------------------------

  onSubmit() {
    // Validación mínima para evitar enviar formularios vacíos si se saltan los 'required' del HTML
    if (!this.user.username || !this.user.password) {
        this.error = 'El nombre de usuario y la contraseña son requeridos.';
        return;
    }

    this.isLoading = true;
    this.error = null;

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    // Llamar al método login del servicio con 'username'
    this.authService.login(this.user.username, this.user.password!)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          // La redirección al home ocurre dentro del AuthService (tap operator)
        },
        error: (errorRes) => {
          this.error = this.getErrorMessage(errorRes, 'Error de inicio de sesión. Credenciales incorrectas o usuario no encontrado.');
          this.isLoading = false;
        }
      });
  }

  private handleRegister() {
    // El email solo es requerido en el registro
    if (!this.user.email) {
        this.error = 'El email es requerido para el registro.';
        this.isLoading = false;
        return;
    }
    
    // Llamar al método register del servicio
    this.authService.register(this.user)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          // Muestra el nombre de usuario de la respuesta
          // Usamos alert temporalmente, pero se recomienda un modal personalizado.
          alert(`Registro exitoso para ${user.username}! Redirigiendo...`); 
          // Ya que el AuthService inicia sesión, redirigimos al home.
          this.router.navigate(['/']); 
        },
        error: (errorRes) => {
          this.error = this.getErrorMessage(errorRes, 'Error en el registro. El nombre de usuario o email pueden ya existir.');
          this.isLoading = false;
        }
      });
  }

  // Función para extraer un mensaje de error legible del objeto de respuesta HTTP
  private getErrorMessage(errorRes: any, defaultMsg: string): string {
    // Intenta extraer un mensaje de error de Spring Boot si está disponible
    if (errorRes.error && errorRes.error.message) {
      return errorRes.error.message;
    }
    if (errorRes.error && typeof errorRes.error === 'string') {
        return errorRes.error; 
    }
    return defaultMsg;
  }
}