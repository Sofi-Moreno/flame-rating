import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { AuthService } from '../service/auth';
import { User } from '../model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  // CommonModule es crucial aquí para usar `*ngIf` en el template
  imports: [CommonModule], 
  templateUrl: './view-profile.html',
  styleUrls: ['./view-profile.css']
})
export class ViewProfile implements OnInit, OnDestroy { 

  private authService = inject(AuthService);
  private userSubscription: Subscription | undefined;

  // Variable para almacenar el usuario actual. Inicialmente nulo.
  currentUser: User | null = null;
  isLoading: boolean = true; // Indicador de carga inicial

  ngOnInit(): void {
    // Suscripción al BehaviorSubject del AuthService para obtener el usuario
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false; // Detener el indicador de carga una vez que se obtienen los datos
      
      // Opcional: Si por alguna razón el usuario se desloguea, podríamos redirigir.
      // if (!user) {
      //   // this.router.navigate(['/login-register']); 
      // }
    });
  }

  // Limpieza: Es fundamental desuscribirse para evitar fugas de memoria
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Genera el texto del rol basado en el campo isAdmin.
   * Usado en el HTML con {{ getRoleText() }}
   */
  getRoleText(): string {
    if (!this.currentUser) return '';
    return this.currentUser.isAdmin ? 'Administrador' : 'Usuario Estándar';
  }
}