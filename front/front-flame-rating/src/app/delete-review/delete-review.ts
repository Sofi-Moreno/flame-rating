import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-review',
  standalone: true, // Asegúrate de que sea standalone si no usas Modules
  templateUrl: './delete-review.html',
  styleUrl: './delete-review.css',
})
export class DeleteReview {
  @Input() reviewId!: number | null;
  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() confirmedDelete = new EventEmitter<number>();

  close(): void {
    this.closeDialog.emit();
  }

  onDelete(): void {
    if (this.reviewId !== null) {
      this.confirmedDelete.emit(this.reviewId);
      // El cierre lo maneja el padre tras recibir el evento o aquí mismo
    }
  }
}
