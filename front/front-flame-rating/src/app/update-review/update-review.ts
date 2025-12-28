import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../service/review-service';
@Component({
  selector: 'app-update-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-review.html',
  styleUrl: './update-review.css',
})
export class UpdateReview implements OnInit {
  @Input() reviewId!: number;
  @Input() currentComment?: string = '';
  @Input() selectedRating?: number; // Ahora sí recibirá el valor del padre
  @Input() userName?: string;


  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() reviewUpdated = new EventEmitter<void>(); // Añadida la 'd' para coincidir con el padre

  reviewForm!: FormGroup;
  readonly max_chars = 500;
  readonly min_chars = 20;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    // CORRECCIÓN: Inicializar el formulario con el valor que viene del padre
    this.reviewForm = this.fb.group({
      comment: [this.currentComment, [ // <--- Aquí cargamos el texto actual
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
    if (this.reviewForm.valid) { 
      const updatedData = {
        id: this.reviewId, // Es vital enviar el ID para saber cuál editar
        rating: this.selectedRating, 
        comment: this.reviewForm.value.comment.trim(),
        userName: this.userName // Usamos el input dinámico
        
      };
      console.log('Datos a enviar para actualización:', updatedData);
      this.reviewService.updateReview(updatedData).subscribe({
        next: () => {
          this.reviewUpdated.emit(); // Avisamos al padre del éxito
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
        }
      });
    }
  }
}
