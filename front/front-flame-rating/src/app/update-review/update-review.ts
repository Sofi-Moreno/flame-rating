import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  
  // Ajustamos a 'number = 0' para manejar la lógica de interacción visual sin errores de 'undefined'
  @Input() selectedRating: number = 0; 
  @Input() userName?: string;

  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() reviewUpdated = new EventEmitter<void>();

  reviewForm!: FormGroup;
  readonly max_chars = 500;
  readonly min_chars = 20;

  // --- NUEVAS PROPIEDADES (Lógica de Flamitas) ---
  public hoveredRating: number = 0; 
  
  // Referencia al contenedor de partículas en el HTML
  @ViewChild('particleContainer') particleContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario con el valor que viene del padre
    this.reviewForm = this.fb.group({
      comment: [this.currentComment, [ 
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

  // --- NUEVAS FUNCIONES (Lógica de Flamitas y Partículas) ---

  public rate(rating: number): void {
    // Si da click en la misma estrella, la desmarca, si no, asigna el valor
    if (this.selectedRating === rating) {
      this.selectedRating = 0;
    } else {
      this.selectedRating = rating;
      if (this.selectedRating > 0) {
        this.triggerParticleEffect();
      }
    }
  }

  public handleMouseOver(rating: number): void {
    this.hoveredRating = rating;
  }

  public handleMouseLeave(): void {
    this.hoveredRating = 0; 
  }

  private triggerParticleEffect(): void {
    if (!this.particleContainer) return;

    const container = this.particleContainer.nativeElement;
    container.innerHTML = ''; // Limpia partículas viejas
    
    for (let i = 0; i < 5; i++) { 
      const particle = document.createElement('img');
      particle.src = '/flame-rating-images/flame-icon-interaction.png'; 
      particle.classList.add('flame-particle');
      
      const x = Math.random() * 100; 
      particle.style.left = `${x}%`;
      particle.style.top = '0px'; 
      
      const delay = Math.random() * 0.2; 
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }
  }

  // --- Función de Envío ---

  onSubmit(): void {
    // Agregamos validación: Formulario válido Y Rating seleccionado
    if (this.reviewForm.valid && this.selectedRating > 0) { 
      const updatedData = {
        id: this.reviewId,
        rating: this.selectedRating, // Enviamos el valor actualizado por las flamas
        comment: this.reviewForm.value.comment.trim(),
        userName: this.userName 
      };
      
      console.log('Datos a enviar para actualización:', updatedData);
      
      this.reviewService.updateReview(updatedData).subscribe({
        next: () => {
          this.reviewUpdated.emit(); 
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
        }
      });
    }
  }
}