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

  // --- VARIABLES DE CONTROL ---
  isEditing: boolean = false;      // Controla si se muestra el formulario o los datos
  showDeleteModal: boolean = false; // Controla la visibilidad de la ventana de confirmación
  
  // Objeto temporal para no modificar el usuario original hasta que se guarde
  editData: User = { username: '', email: '', password: '', isAdmin: false };
  
  // Variables para el cambio de contraseña
  newPassword: string = '';
  confirmPassword: string = '';

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
    this.clearPasswordFields();
    if (this.isEditing) {
      this.resetEditData();
    }
  }

  /**
   * Limpia los campos de contraseña
   */
  private clearPasswordFields(): void {
    this.newPassword = '';
    this.confirmPassword = '';
  }

  /**
   * Copia los datos actuales al objeto temporal de edición.
   */
  resetEditData(): void {
    if (this.currentUser) {
      this.editData = { 
        ...this.currentUser, 
        password: '' // Inicialmente vacío
      };
    }
  }

  /**
   * Lógica para enviar la actualización al backend
   */
  onUpdate(): void {
    if (!this.currentUser?.idUser) return;

    // Validación de contraseñas si el usuario intenta cambiarlas
    if ( this.newPassword || this.confirmPassword) {
      
      // 1. Verificar que se hayan llenado los campos necesarios
      if ( !this.newPassword || !this.confirmPassword) {
        this.message = 'Para cambiar la contraseña, debe completar los tres campos de seguridad.';
        this.messageType = 'error';
        return;
      }

      // 2. Verificar que la nueva contraseña coincida con la confirmación
      if (this.newPassword !== this.confirmPassword) {
        this.message = 'La nueva contraseña y su confirmación no coinciden.';
        this.messageType = 'error';
        return;
      }

      // 3. Asignar la nueva contraseña al objeto que se enviará
      this.editData.password = this.newPassword;
    } else {
      // Si no hay intención de cambiar contraseña, aseguramos que viaje vacía 
      // para que el backend sepa que no debe actualizarla.
      this.editData.password = '';
    }

    this.authService.updateUser(this.currentUser.idUser, this.editData).subscribe({
      next: (updatedUser) => {
        this.isEditing = false;
        this.message = 'Perfil actualizado correctamente.';
        this.messageType = 'success';
        this.clearPasswordFields();
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