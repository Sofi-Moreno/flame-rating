import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-video-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-video-game.html',
  styleUrl: './delete-video-game.css',
})
export class DeleteVideoGame {
  // Datos que vienen del componente padre
  @Input() videoGameId!: number;
  @Input() videoGameName!: string;
  
  // Eventos para comunicar resultados al padre
  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() confirmedDelete = new EventEmitter<number>();

  constructor() {}

  // Cierra el modal sin hacer nada
  close(): void {
    this.closeDialog.emit();
  }

  // Notifica que el usuario confirmó la eliminación
  onDelete(): void {
    console.log('Confirmada eliminación del ID:', this.videoGameId);
    
    // Emitimos el ID para que el padre se encargue de llamar al servicio
    this.confirmedDelete.emit(this.videoGameId);
    
    // Opcional: cerramos el modal después de emitir
    this.close();
  }
}
