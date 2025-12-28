import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../service/review-service';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-review.html',
  styleUrl: './create-review.css',
})
export class CreateReview implements OnInit {
  @Input() videoGameId!: number;
  @Input() selectedRating!: number; // Ahora sí recibirá el valor del padre
  @Input() userName: string = 'Anónimo'; // Recibimos el nombre real

  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() reviewSaved = new EventEmitter<void>();

  reviewForm!: FormGroup;
  readonly max_chars = 500;
  readonly min_chars = 20;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      comment: ['', [
        Validators.required, 
        Validators.minLength(this.min_chars), 
        Validators.maxLength(this.max_chars)
      ]]
    });
  }

  get remainingChars(): number {
    const commentValue = this.reviewForm.get('comment')?.value || '';
    return this.max_chars - commentValue.length;
  }

  close(): void {
    this.closeDialog.emit();
  }

  onSubmit(): void {
    // Verificamos que tengamos rating y que el formulario sea válido
    if (this.reviewForm.valid && this.selectedRating > 0) { 
      const newReview = {
        videoGameId: this.videoGameId, 
        rating: this.selectedRating, 
        comment: this.reviewForm.value.comment.trim(), 
        userName: this.userName, // Usamos el input dinámico
      };

      this.reviewService.saveReview(newReview).subscribe({
        next: () => {
          this.reviewSaved.emit(); // El padre se encarga de recargar y cerrar
        },
        error: (err) => {
          console.error('Error al guardar el comentario:', err);
        }
      });
    }
  }
}