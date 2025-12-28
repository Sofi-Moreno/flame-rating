import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el formulario de edición
import { AuthService } from '../service/auth';
import { User } from '../model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './view-profile.html',
  styleUrls: ['./view-profile.css']
})
export class ViewProfile implements OnInit, OnDestroy { 

  private authService = inject(AuthService);
  private userSubscription: Subscription | undefined;

  // Estado del usuario
  currentUser: User | null = null;
  isLoading: boolean = true;

  // --- NUEVAS VARIABLES PARA SPRINT 2 ---
  isEditing: boolean = false;      // Controla si se muestra el formulario o los datos
  showDeleteModal: boolean = false; // Controla la visibilidad de la ventana de confirmación
  
  // Objeto temporal para no modificar el usuario original hasta que se guarde
  editData: User = { username: '', email: '', password: '', isAdmin: false };
  
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoading = false;
      
      if (user) {
        this.resetEditData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * Cambia entre modo lectura y modo edición.
   */
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.message = '';
    if (this.isEditing) {
      this.resetEditData();
    }
  }

  
  /**
   * Copia los datos actuales al objeto temporal de edición.
   */
  resetEditData(): void {
    if (this.currentUser) {
      this.editData = { 
        ...this.currentUser, 
        password: '' // No mostramos la contraseña actual por seguridad
      };
    }
  }

  /**
   * Lógica para enviar la actualización al backend
   */
  onUpdate(): void {
    if (!this.currentUser?.idUser) return;

    this.authService.updateUser(this.currentUser.idUser, this.editData).subscribe({
      next: (updatedUser) => {
        this.isEditing = false;
        this.message = 'Perfil actualizado correctamente.';
        this.messageType = 'success';
      },
      error: (err) => {
        this.message = err.error || 'Error al actualizar el perfil.';
        this.messageType = 'error';
      }
    });
  }

  /**
   * Lógica para eliminar la cuenta definitivamente
   */
  onConfirmDelete(): void {
    if (!this.currentUser?.idUser) return;

    this.authService.deleteUser(this.currentUser.idUser).subscribe({
      next: () => {
        this.showDeleteModal = false;
        // El AuthService ya redirige al login al hacer logout interno
      },
      error: (err) => {
        this.showDeleteModal = false;
        this.message = 'No se pudo eliminar la cuenta.';
        this.messageType = 'error';
      }
    });
  }

  getRoleText(): string {
    if (!this.currentUser) return '';
    return this.currentUser.isAdmin ? 'Administrador' : 'Usuario Estándar';
  }
}