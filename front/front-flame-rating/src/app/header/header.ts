import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../service/auth'; 
import { User } from '../model/user'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true, 
  // Importamos CommonModule para *ngIf y RouterLink para routerLink
  imports: [CommonModule, RouterLink], 
  templateUrl: './header.html', // Usando tu nombre de archivo 'header.html'
  styleUrls: ['./header.css'] // Usando tu nombre de archivo 'header.css'
})
export class Header implements OnInit { // Usamos la convención HeaderComponent
  
  private authService = inject(AuthService);
  
  // Observable que rastrea el estado del usuario.
  currentUser$: Observable<User | null> = this.authService.currentUser;
  
  // Variables que el HTML utiliza (se actualizan en ngOnInit)
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    // Suscripción reactiva: se actualiza cada vez que el estado del usuario cambia (login/logout)
    this.currentUser$.subscribe(user => {
      // Si 'user' tiene un valor (no es null), isLoggedIn es true.
      this.isLoggedIn = !!user; 
      // Si 'user' tiene un valor, usa user.isAdmin; de lo contrario, es false.
      this.isAdmin = user ? user.isAdmin : false; 
    });
  }

  /**
   * Llama al método de cerrar sesión del servicio de autenticación.
   * Usado en el HTML con (click)="onLogout()"
   */
  onLogout() {
    this.authService.logout();
  }
}