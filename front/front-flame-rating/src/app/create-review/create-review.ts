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
  // Definimos el límite máximo aquí para tener una única fuente de verdad
  readonly max_chars = 500;
  readonly min_chars = 20;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      // Agregamos el control 'comment' con validación de longitud
      comment: ['', [
        Validators.required, 
        Validators.minLength(this.min_chars), 
        Validators.maxLength(this.max_chars)
      ]]
    });
  }

  // Getter para obtener la longitud actual del texto
  get currentLength(): number {
    return this.reviewForm.get('comment')?.value?.length || 0;
  }

  // Función que Calcula los caracteres restantes
  get remainingChars(): number {
    const commentValue = this.reviewForm.get('comment')?.value || '';
    return this.max_chars - commentValue.length;
  }

  // Determina si mostrar el mensaje de error en rojo
  get showMinLengthError(): boolean {
    const length = this.currentLength;
    return length > 0 && length < this.min_chars;
  }

  // Determina si el botón debe estar deshabilitado
  get isSubmitDisabled(): boolean {
    // Deshabilitado si el formulario no es válido (menos de 20 chars) o no hay puntuación
    return this.reviewForm.invalid || this.selectedRating <= 0;
  }


  close(): void {
    this.closeDialog.emit();
  }

  onSubmit(): void {
    if (this.reviewForm.valid && this.selectedRating > 0) { 
      const newReview = {
        videoGameId: this.videoGameId, 
        rating: this.selectedRating, 
        comment: this.reviewForm.value.comment.trim(), 
        userName: "Usuario_Demo", // Reemplazar por usuario real si aplica
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
