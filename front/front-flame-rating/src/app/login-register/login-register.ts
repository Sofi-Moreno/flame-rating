import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../service/auth'; 
import { User } from '../model/user'; 
import { Router, ActivatedRoute } from '@angular/router'; // <--- Importamos ActivatedRoute

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
  
  // <--- CAMBIO 1: Variable para guardar la URL de retorno
  returnUrl: string = '/'; 

  // Modelo para el formulario
  user: User = { 
    idUser: undefined,            
    username: '',          
    email: '',
    password: '',
    isAdmin: false,       
    profileImage: ''
  } as User; 

  // Inyección de dependencias usando 'inject' (No necesitas constructor)
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // <--- CAMBIO 2: Inyectamos la ruta activa para leer los parámetros
  private route = inject(ActivatedRoute); 

  ngOnInit(): void {
    // <--- CAMBIO 3: Capturamos la URL de retorno al iniciar
    // Si existe 'returnUrl' en la barra de direcciones, la guardamos.
    // Si no, por defecto será '/' (el home).
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Si el usuario ya está logueado, lo mandamos a donde corresponda
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl); // <--- Usamos navigateByUrl
    }
  }

  // -----------------------------------------------------------------------
  // LÓGICA DE INTERFAZ
  // -----------------------------------------------------------------------

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null; 
    this.resetForm();
  }

  resetForm() {
    this.user = { 
        idUser: undefined,
        username: '',
        email: '',
        password: '',
        isAdmin: false,
        profileImage: ''
    } as User;
  }
  
  // -----------------------------------------------------------------------
  // LÓGICA DE BACKEND / AUTHSERVICE
  // -----------------------------------------------------------------------

  onSubmit() {
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
    this.authService.login(this.user.username, this.user.password!)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          
          // <--- CAMBIO 4: Redirección post-login exitoso
          // En lugar de dejar que el servicio decida, forzamos la navegación aquí
          // para volver a la página del videojuego (o al home si no hay returnUrl).
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (errorRes) => {
          this.error = this.getErrorMessage(errorRes, 'Error de inicio de sesión. Credenciales incorrectas o usuario no encontrado.');
          this.isLoading = false;
        }
      });
  }

  private handleRegister() {
    if (!this.user.email) {
        this.error = 'El email es requerido para el registro.';
        this.isLoading = false;
        return;
    }
    
    this.authService.register(this.user)
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          alert(`Registro exitoso para ${user.username}! Redirigiendo...`); 
          
          // <--- CAMBIO 5 (Opcional): También al registrarse lo devolvemos a la página anterior
          this.router.navigateByUrl(this.returnUrl); 
        },
        error: (errorRes) => {
          this.error = this.getErrorMessage(errorRes, 'Error en el registro. El nombre de usuario o email pueden ya existir.');
          this.isLoading = false;
        }
      });
  }

  private getErrorMessage(errorRes: any, defaultMsg: string): string {
    if (errorRes.error && errorRes.error.message) {
      return errorRes.error.message;
    }
    if (errorRes.error && typeof errorRes.error === 'string') {
        return errorRes.error; 
    }
    return defaultMsg;
  }
}