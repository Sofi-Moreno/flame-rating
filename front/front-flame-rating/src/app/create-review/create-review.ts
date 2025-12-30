import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  
  // --- Inputs y Outputs Originales ---
  @Input() videoGameId!: number;
  @Input() selectedRating: number = 0; // Inicializamos en 0 para la lógica de selección
  @Input() userName: string = 'Anónimo'; 

  @Output() closeDialog = new EventEmitter<void>(); 
  @Output() reviewSaved = new EventEmitter<void>();

  // --- Propiedades del Formulario ---
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
    this.reviewForm = this.fb.group({
      comment: ['', [
        Validators.required, 
        Validators.minLength(this.min_chars), 
        Validators.maxLength(this.max_chars)
      ]]
    });
  }

  // --- Getters y Funciones Originales ---

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
      // Solo lanzamos las partículas si hay una selección válida
      if (this.selectedRating > 0) {
        this.triggerParticleEffect();
      }
    }
    // Nota: Aquí no guardamos en BD inmediatamente, eso lo hace onSubmit() al final.
  }

  public handleMouseOver(rating: number): void {
    this.hoveredRating = rating;
  }

  public handleMouseLeave(): void {
    this.hoveredRating = 0; 
  }

  private triggerParticleEffect(): void {
    // Verificamos que el contenedor exista antes de intentar acceder
    if (!this.particleContainer) return;

    const container = this.particleContainer.nativeElement;
    container.innerHTML = ''; // Limpia partículas viejas
    
    for (let i = 0; i < 5; i++) { // Creamos 5 partículas
      const particle = document.createElement('img');
      particle.src = '/flame-rating-images/flame-icon-interaction.png'; // Asegúrate que esta ruta sea accesible
      particle.classList.add('flame-particle');
      
      // 1. Posición horizontal aleatoria (0% a 100% del ancho)
      const x = Math.random() * 100; 
      particle.style.left = `${x}%`;
      
      // 2. Empieza desde arriba
      particle.style.top = '0px'; 
      
      // 3. Retraso aleatorio
      const delay = Math.random() * 0.2; 
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
      
      // 4. Borra la partícula después de 2 segundos
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }
  }

  // --- Función de Envío Original ---

  onSubmit(): void {
    // Verificamos que tengamos rating y que el formulario sea válido
    if (this.reviewForm.valid && this.selectedRating > 0) { 
      const newReview = {
        videoGameId: this.videoGameId, 
        rating: this.selectedRating, 
        comment: this.reviewForm.value.comment.trim(), 
        userName: this.userName, 
      };

      this.reviewService.saveReview(newReview).subscribe({
        next: () => {
          this.reviewSaved.emit(); 
        },
        error: (err) => {
          console.error('Error al guardar el comentario:', err);
        }
      });
    }
  }
}