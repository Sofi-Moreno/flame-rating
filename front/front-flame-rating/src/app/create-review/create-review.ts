import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../service/review-service'; // Debes crear este servicio
@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-review.html',
  styleUrl: './create-review.css',
})
export class CreateReview implements OnInit{
// Recibe el ID del juego desde el componente padre
  @Input() videoGameId!: number;
  
  // Emite un evento cuando se guarda o se cierra
  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() reviewSaved = new EventEmitter<void>();
  @Input() selectedRating!: number;

  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
    });
  }

  close(): void {
    this.closeDialog.emit();
  }

  onSubmit(): void {
    // 1. VALIDACIÓN: Si selectedRating es 0, no guarda (esto también inhabilita el botón)
    if (this.selectedRating <= 0) {
        // Esto no debería pasar si el botón está bien deshabilitado, pero es una protección
        alert('Por favor, selecciona una puntuación antes de guardar.');
        return;
    }
    
    // 2. Si el formulario es estructuralmente válido (longitud del comentario ok)
    if (this.reviewForm.valid) { 
      const formValue = this.reviewForm.value;
      
      const newReview = {
        videoGameId: this.videoGameId, 
        rating: this.selectedRating, 
        comment: formValue.comment ? formValue.comment.trim() : '', 
        userName: "sgmoreno.23", // Asume un userId fijo
      };

      // 3. Llamar al servicio para guardar
      this.reviewService.saveReview(newReview).subscribe({
        next: () => {
          this.reviewSaved.emit(); // Notifica al padre para recargar
        },
        error: (err) => {
          console.error('Error al guardar el comentario:', err);
          alert('Hubo un error al guardar la calificación.');
        }
      });
    }
  }
}
