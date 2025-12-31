import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { VideoGame } from '../model/video-game';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { VideoGameService } from '../service/video-game-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first, delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-videogame',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink 
  ],
  templateUrl: './create-videogame.html',
  styleUrl: './create-videogame.css',
})
export class CreateVideogame implements OnInit{

  constructor(
    private fb: FormBuilder,
    private videogameService: VideoGameService,
    private router: Router,
    // --- ¡CAMBIO 2! ---
    // Inyecta el 'ChangeDetectorRef' (el "despertador")
    private cdr: ChangeDetectorRef
  ){}

  videoGameForm!: FormGroup;
  // ... (todas tus otras propiedades (regex, listas, etc.) están perfectas) ...
  youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  videoGame: VideoGame | null = null;
  generosLista = [
    'Deportes', 'Accion', 'Aventura', 'Terror', 'Rol', 
    'Sandbox', 'Carreras', 'Supervivencia', 'Shooters'
  ];
  consolasLista = [
    'Xbox', 'Nintendo Switch 1', 'Nintendo Switch 2', 'PlayStation 5', 'PC'
  ];
  public mainImagePreview: string | null = null;
  public extraImagesPreviews: string[] = [];
  // --- ¡NUEVAS PROPIEDADES! ---
  // Para mostrar los nombres de los archivos en el HTML
  public mainImageName: string = 'Seleccionar archivo...';
  public extraImagesName: string = 'Seleccionar archivos...';
  public selectedExtraFiles: File[] = [];


  // ... (todos tus 'getters' (title, developer, etc.) están perfectos) ...
  get title() { return this.videoGameForm.get('title'); }
  get developer() { return this.videoGameForm.get('developer'); }
  get synopsis() { return this.videoGameForm.get('synopsis'); }
  get releaseDate() { return this.videoGameForm.get('releaseDate'); }
  get category() { return this.videoGameForm.get('category'); }
  get genres() { return this.videoGameForm.get('genres'); }
  
  // ¡¡¡CORRECCIÓN DEL BUG!!!
  // El getter 'consoles' (con 'e') debe apuntar al control 'consoles' (con 'e')
  get consoles() { return this.videoGameForm.get('consoles'); } 
  
  get image() { return this.videoGameForm.get('image'); }
  get youtubeLink() { return this.videoGameForm.get('youtubeLink'); }

  onSubmit(): void {
    this.videoGameForm.markAllAsTouched();
    if (this.videoGameForm.invalid) {
      console.error('Formulario inválido. Revisa los campos.');
      return;
    }
    const formData = this.createFormData();
    this.videogameService.saveVideogame(formData).pipe(
        delay(1000) 
    ).subscribe({
        next: (videojuegoGuardado) => {
          console.log('¡Videojuego guardado con éxito!', videojuegoGuardado);
          this.router.navigate(['/videogame', videojuegoGuardado.id]); 
          Swal.fire({
            icon: 'success',
            title: 'Videojuego Creado',
            text: 'El videojuego ha sido creado con éxito.',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Error al guardar el videojuego', err);
        }
    });
  }

  generosGroup = this.generosLista.reduce((acc: {[key: string]: any}, genero) => {
    acc[genero] = [false];
    return acc;
  }, {});
  
  consolasGroup = this.consolasLista.reduce((acc: {[key: string]: any}, consola) => {
    acc[consola] = [false];
    return acc;
  }, {});

  ngOnInit(): void {
   this.videoGameForm = this.fb.group({
      title:     ['', [Validators.required],
        [this.titleExistsValidator()]],
      developer: ['', Validators.required],
      synopsis:  ['', Validators.required],
      releaseDate: ['', Validators.required],
      category:    ['', Validators.required],
      genres: this.fb.group(this.generosGroup, { 
        validators: this.minCheckboxesSelected(1) 
      }),
      
      // Este nombre 'consoles' (con 'e') es el correcto y coincide con el getter
      consoles: this.fb.group(this.consolasGroup, { 
        validators: this.minCheckboxesSelected(1) 
      }),
      
      image:   [null, Validators.required],
      images: [null],
      youtubeLink: ['', [
        Validators.required, 
        Validators.pattern(this.youtubeRegex)
      ]]
   });

   // --- ¡CAMBIO 3! (La Solución Fuerte) ---
   // Usamos setTimeout para forzar la detección de cambios DESPUÉS
   // de que el formulario se haya inicializado por completo.
   setTimeout(() => this.cdr.detectChanges(), 0);
  }

  // ... (todos tus otros métodos (minCheckboxesSelected, 
  // titleExistsValidator, createFormData) están perfectos) ...
  
  minCheckboxesSelected(min = 1) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      let selectedCount = 0;
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          selectedCount++;
        }
      });
      if (selectedCount < min) {
        return { minSelected: true }; 
      }
      return null; 
    };
  }

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let fileToStore = null;

    if (input.files && input.files.length > 0) {
      if (controlName === 'images') {
        // 1. Guardamos los archivos reales en nuestro array auxiliar
        // Usamos Array.from porque input.files es un FileList, no un Array
        this.selectedExtraFiles = Array.from(input.files);
        
        // 2. Actualizamos el texto
        this.updateExtraImagesLabel();
        
        // 3. Generamos vistas previas
        this.extraImagesPreviews = [];
        this.selectedExtraFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.extraImagesPreviews.push(e.target.result);
            this.cdr.detectChanges(); 
          };
          reader.readAsDataURL(file);
        });

        // Asignamos algo al control para que sepa que "hay algo", 
        // aunque usaremos selectedExtraFiles al guardar
        fileToStore = input.files;

      } else {
        // Lógica Imagen Principal (se mantiene igual)
        const file = input.files[0];
        fileToStore = file;
        this.mainImageName = file.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.mainImagePreview = e.target.result;
          this.cdr.detectChanges(); 
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Si el usuario cancela la selección
      if (controlName === 'images') {
        this.extraImagesName = 'Seleccionar archivos...';
        this.extraImagesPreviews = [];
        this.selectedExtraFiles = []; // Limpiamos array
      } else {
        this.mainImageName = 'Seleccionar archivo...';
        this.mainImagePreview = null;
      }
      fileToStore = null;
    }

    this.videoGameForm.patchValue({ [controlName]: fileToStore });
    this.videoGameForm.get(controlName)?.markAsTouched();
  }

  // --- ¡NUEVA FUNCIÓN!: Eliminar imagen extra ---
  removeExtraImage(index: number) {
    // 1. Eliminamos del array de archivos reales
    this.selectedExtraFiles.splice(index, 1);

    // 2. Eliminamos de la vista previa
    this.extraImagesPreviews.splice(index, 1);

    // 3. Actualizamos el texto del label
    this.updateExtraImagesLabel();

    // 4. (Opcional) Si te quedas sin imágenes, podrías limpiar el input,
    // pero como usaremos selectedExtraFiles en el submit, no es estrictamente necesario.
  }

  // Helper para actualizar el texto del label
  updateExtraImagesLabel() {
    if (this.selectedExtraFiles.length === 0) {
      this.extraImagesName = 'Seleccionar archivos...';
    } else if (this.selectedExtraFiles.length === 1) {
      this.extraImagesName = '1 archivo seleccionado';
    } else {
      this.extraImagesName = `${this.selectedExtraFiles.length} archivos seleccionados`;
    }
  }
 
  public openDatePicker(event: Event): void {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch (error) {
      console.error('showPicker error', error);
    }
  }
 
  titleExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      
      if (!control.value || control.hasError('required')) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(500), 
        first(),           
        switchMap(title => 
          this.videogameService.findByTitle(title).pipe(
            
            map(videoGame => {
              return videoGame ? { titleExists: true } : null;
            }),
            
            catchError(() => {
              return of(null); 
            })
          )
        )
      );
    };
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.videoGameForm.value;

    const selectedGenres = Object.keys(formValue.genres)
      .filter(key => formValue.genres[key] === true) 
      .join(','); 

    // ¡¡¡CORRECCIÓN DEL BUG!!!
    // Ahora busca 'consoles' (con 'e'), que es el nombre correcto del FormGroup
    const selectedPlatforms = Object.keys(formValue.consoles) 
      .filter(key => formValue.consoles[key] === true)
      .join(',');

    const videoGameData = {
      title: formValue.title,
      releaseDate: formValue.releaseDate,
      synopsis: formValue.synopsis,
      urlTrailer: formValue.youtubeLink, 
      developer: formValue.developer,
      category: formValue.category,
      genre: selectedGenres,     
      platform: selectedPlatforms, 
      averageRating: 0          
    };

    formData.append('videoGame', JSON.stringify(videoGameData));

    const mainImageFile = this.videoGameForm.get('image')?.value;
    if (mainImageFile) {
      formData.append(
        'mainImage', 
        mainImageFile, 
        mainImageFile.name
      );
    }

    // --- ¡CAMBIO CRUCIAL AQUÍ! ---
    // En lugar de leer del form (que tiene el FileList original inmutable),
    // leemos de nuestro array 'selectedExtraFiles' que ya modificamos con la X
    if (this.selectedExtraFiles && this.selectedExtraFiles.length > 0) {
      for (let i = 0; i < this.selectedExtraFiles.length; i++) {
        formData.append(
          'images', 
          this.selectedExtraFiles[i],
          this.selectedExtraFiles[i].name
        );
      }
    }
    return formData;
  } 
}