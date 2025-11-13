import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { VideoGame } from '../model/video-game';
import { VideoGameService } from '../service/video-game-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first, delay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-videogame',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './create-videogame.html',
  styleUrl: './create-videogame.css',
})
export class CreateVideogame implements OnInit{

  constructor(
    private fb: FormBuilder,
    private videogameService: VideoGameService,
    private router: Router
  ){}

  videoGameForm!: FormGroup;
  // Expresión regular para YouTube
  youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  videoGame: VideoGame | null = null;
  // Lista de géneros (para que sea más fácil crear el form)
  generosLista = [
    'Deportes', 'Accion', 'Aventura', 'Terror', 'Rol', 
    'Sandbox', 'Carreras', 'Supervivencia', 'Shooters'
  ];
  
  // Lista de consolas
  consolasLista = [
    'Xbox', 'Nintendo Switch 1', 'Nintendo Switch 2', 'PlayStation 5', 'PC'
  ];

  get title() { return this.videoGameForm.get('title'); }
  get developer() { return this.videoGameForm.get('developer'); }
  get synopsis() { return this.videoGameForm.get('synopsis'); }
  get releaseDate() { return this.videoGameForm.get('releaseDate'); }
  get category() { return this.videoGameForm.get('category'); }
  get genres() { return this.videoGameForm.get('genres'); }
  get consoles() { return this.videoGameForm.get('consolas'); }
  get image() { return this.videoGameForm.get('image'); }
  get youtubeLink() { return this.videoGameForm.get('youtubeLink'); }

  onSubmit(): void {
    // 1. Marca todo como 'tocado' para mostrar los errores si el usuario
    // intenta enviar un formulario vacío.
    this.videoGameForm.markAllAsTouched();

    // 2. Si el formulario (incluyendo el validador asíncrono) es inválido,
    // se detiene aquí.
    if (this.videoGameForm.invalid) {
      console.error('Formulario inválido. Revisa los campos.');
      return;
    }

    // 3. Si el formulario es VÁLIDO, creamos el FormData
    const formData = this.createFormData();

   this.videogameService.saveVideogame(formData).pipe(
        // Añadir un retardo de 400ms después de que la respuesta del servidor sea exitosa
        delay(400) // ⬅️ Nuevo operador para esperar
    ).subscribe({
        next: (videojuegoGuardado) => {
            // ÉXITO: Este código se ejecuta 400ms después de recibir la respuesta 201
            console.log('¡Videojuego guardado con éxito!', videojuegoGuardado);
            
            // La navegación se realiza DESPUÉS del retardo.
            // Esto le da tiempo al servidor para liberar los archivos.
            this.router.navigate(['/videogame', videojuegoGuardado.id]); 
        },
        error: (err) => {
            // ERROR
            console.error('Error al guardar el videojuego', err);
        }
    });
  }

  // 2. CREA LOS FORMGROUPS PARA LOS CHECKBOXES
    // Usamos 'reduce' para convertir el array de strings en un objeto de FormControls
    // El resultado será: { deportes: [false], accion: [false], ... }
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
      // 4. AÑADE LOS GRUPOS Y APLICA EL VALIDADOR PERSONALIZADO
      genres: this.fb.group(this.generosGroup, { 
        validators: this.minCheckboxesSelected(1) 
      }),
      
      consoles: this.fb.group(this.consolasGroup, { 
        validators: this.minCheckboxesSelected(1) 
      }),

      // 1. AÑADE EL CONTROL PARA LA IMAGEN PRINCIPAL
      // El valor inicial es 'null'. Validators.required fallará si sigue
      // siendo 'null' cuando el usuario intente enviar.
      image:  [null, Validators.required],
      
      // Añadimos el de imágenes complementarias (sin 'required')
      images: [null],
      // 2. AÑADE LOS VALIDADORES AL CONTROL 'youtubeLink'
      youtubeLink: ['', [
        Validators.required, 
        Validators.pattern(this.youtubeRegex)
      ]]
   });

   
  }

  // 5. NUESTRA FUNCIÓN VALIDADORA PERSONALIZADA
  minCheckboxesSelected(min = 1) {
    // Esta función devuelve otra función (un validador)
    return (formGroup: FormGroup): ValidationErrors | null => {
      let selectedCount = 0;
      
      // Recorre todos los controles (deportes, accion, etc.)
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        // Si el valor del control es 'true' (está marcado)
        if (control.value === true) {
          selectedCount++;
        }
      });

      // Si el contador es menor que el mínimo, devolvemos un error
      if (selectedCount < min) {
        return { minSelected: true }; // El nombre del error
      }

      return null; // ¡Válido!
    };
  }

  // 2. CREA ESTE MÉTODO
  /**
   * Se llama cuando el usuario selecciona un archivo.
   * Actualiza el valor del FormGroup manualmente.
   */
  onFileChange(event: Event, controlName: string) {
    // Obtenemos el <input> que disparó el evento
    const input = event.target as HTMLInputElement;

    let fileToStore = null;

    // Verificamos si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      if (controlName === 'images') {
        // Si es el input múltiple, guarda la lista de archivos
        fileToStore = input.files;
      } else {
        // Si es el input singular, guarda solo el primer archivo
        fileToStore = input.files[0];
      }
    }

    // 3. "Parcheamos" el valor de nuestro control (ej. 'image')
    // con el archivo (File) o la lista de archivos (FileList)
    this.videoGameForm.patchValue({
      [controlName]: fileToStore
    });

    // 4. Marcamos el control como "tocado" para que los errores aparezcan
    this.videoGameForm.get(controlName)?.markAsTouched();
  }
  // --- ESTE ES EL MÉTODO QUE DEBES ADAPTAR ---
  //
  titleExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      
      if (!control.value || control.hasError('required')) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(500), // Espera 500ms
        first(),           // Toma el primer valor
        switchMap(title => 
          // Llama a TU servicio
          this.videogameService.findByTitle(title).pipe(
            
            // --- LÓGICA DE ÉXITO ---
            // Si el servicio devuelve un VideoGame (no es un error),
            // significa que el título YA EXISTE.
            map(videoGame => {
              // Si videoGame no es nulo, el título existe, por lo tanto es un error.
              return videoGame ? { titleExists: true } : null;
            }),
            
            // --- LÓGICA DE ERROR (404) ---
            // Si el servicio da un error (ej. 404 Not Found), 
            // 'catchError' lo captura. Significa que el título NO EXISTE.
            catchError(() => {
              // No existe, por lo tanto es VÁLIDO. Devolvemos 'null'.
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

    // --- 1. Transformar Checkboxes en Strings ---

    // Géneros: { deportes: true, accion: false } -> "deportes"
    const selectedGenres = Object.keys(formValue.genres)
      .filter(key => formValue.genres[key] === true) // Filtra solo los marcados
      .join(','); // Une con comas: "deportes,aventura,rol"

    // Plataformas: { pc: true, ps5: true } -> "pc,ps5"
    const selectedPlatforms = Object.keys(formValue.consoles)
      .filter(key => formValue.consoles[key] === true)
      .join(',');

    // --- 2. Crear el Objeto JSON (sin imágenes) ---
    // El backend se encargará de crear el 'urlImages'
    const videoGameData = {
      title: formValue.title,
      releaseDate: formValue.releaseDate,
      synopsis: formValue.synopsis,
      urlTrailer: formValue.youtubeLink, // Mapea el nombre del control
      developer: formValue.developer,
      category: formValue.category,
      genre: selectedGenres,     // "Deportes,Accion"
      platform: selectedPlatforms, // "Xbox Series,PC"
      averageRating: 0             // Valor inicial
    };

    // --- 3. Añadir todo al FormData ---

    // Añade el JSON como un 'Blob' (el estándar para enviar JSON + Archivos)
    formData.append('videoGame', JSON.stringify(videoGameData));

    // Añade la imagen principal (el archivo)
    // El 'get' es de FormGroup, no el getter que creamos
    const mainImageFile = this.videoGameForm.get('image')?.value;
    if (mainImageFile) {
      formData.append(
        'mainImage', // El backend debe esperar 'mainImage'
        mainImageFile, 
        mainImageFile.name
      );
    }

    // Añade las imágenes complementarias (múltiples archivos)
    const extraImagesFiles = this.videoGameForm.get('images')?.value;
    if (extraImagesFiles) {
      for (let i = 0; i < extraImagesFiles.length; i++) {
        formData.append(
          'images', // El backend debe esperar un array 'images'
          extraImagesFiles[i],
          extraImagesFiles[i].name
        );
      }
    }

    return formData;
  }
}
