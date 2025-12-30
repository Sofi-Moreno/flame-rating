import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { VideoGame } from '../model/video-game';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { VideoGameService } from '../service/video-game-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first, delay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-videogame',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink 
  ],
  templateUrl: './update-videogame.html',
  styleUrl: './update-videogame.css',
})

export class UpdateVideogame implements OnInit{
  constructor(
    private fb: FormBuilder,
    private videogameService: VideoGameService,
    private router: Router,
    private route: ActivatedRoute, // Para leer el ID
    private cdr: ChangeDetectorRef
  ){}
  videoGameForm!: FormGroup;
  gameId!: number;
  mainImageName: string = 'Cambiar imagen principal...';
  extraImagesName: string = 'Agregar imagenes extra...';
  public currentMainImage: string = '';
  public currentExtraImages: string[] = [];
  public newExtraImagesPreviews: string[] = [];
  youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  videoGame: VideoGame | null = null;
  generosLista = [
    'Deportes', 'Accion', 'Aventura', 'Terror', 'Rol', 
    'Sandbox', 'Carreras', 'Supervivencia', 'Shooters'
  ];
  consolasLista = [
    'Xbox', 'Nintendo Switch 1', 'Nintendo Switch 2', 'PlayStation 5', 'PC'
  ];


  get title() { return this.videoGameForm.get('title'); }
  get developer() { return this.videoGameForm.get('developer'); }
  get synopsis() { return this.videoGameForm.get('synopsis'); }
  get releaseDate() { return this.videoGameForm.get('releaseDate'); }
  get category() { return this.videoGameForm.get('category'); }
  get genres() { return this.videoGameForm.get('genres'); }
  get consoles() { return this.videoGameForm.get('consoles'); } 
  get image() { return this.videoGameForm.get('image'); }
  get youtubeLink() { return this.videoGameForm.get('youtubeLink'); }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadGameData();
  }

  private initForm() {
    // Replicamos exactamente tu estructura de creación
    this.videoGameForm = this.fb.group({
      title: ['', [Validators.required]],
      developer: ['', Validators.required],
      synopsis: ['', Validators.required],
      releaseDate: ['', Validators.required],
      category: ['', Validators.required],
      genres: this.fb.group(this.generosGroup), 
      consoles: this.fb.group(this.consolasGroup),
      image: [null], // OPCIONAL en editar (si no sube nada, se queda la anterior)
      images: [null],
      youtubeLink: ['', [Validators.required, Validators.pattern(this.youtubeRegex)]]
    });
  }

  onSubmit(): void {
    this.videoGameForm.markAllAsTouched();
    if (this.videoGameForm.invalid) {
      console.error('Formulario inválido. Revisa los campos.');
      return;
    }
    const formData = this.createFormData();
    this.videogameService.updateVideoGame(formData).pipe(
        delay(1000) 
    ).subscribe({
        next: (videojuegoEditado) => {
          console.log('¡Videojuego editado con éxito!', videojuegoEditado);
          this.router.navigate(['/videogame', videojuegoEditado.id]); 
          Swal.fire({
            icon: 'success',
            title: 'Videojuego Editado',
            text: 'El videojuego ha sido editado con éxito.',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          console.error('Error al editar el videojuego', err);
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

 
  // --- ¡NUEVA FUNCIÓN! ---
  public openDatePicker(event: Event): void {
    try {
      (event.target as HTMLInputElement).showPicker();
    } catch (error) {
      console.error('showPicker() no es soportado por este navegador.', error);
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

  removeExtraImage(index: number) {
    this.currentExtraImages.splice(index, 1);
    this.videoGameForm.markAsDirty(); // <--- Habilita el botón al borrar
    this.cdr.detectChanges();
  }

  // 2. Ajuste en loadGameData para cargar las URLs correctamente
  private loadGameData() {
    this.videogameService.findById(this.gameId).subscribe(game => {
      this.videoGame = game;
      const imagesArray = game.urlImages ? game.urlImages.split(',') : [];
      
      this.currentMainImage = imagesArray[0] || '';
      this.currentExtraImages = imagesArray.slice(1);

      // Precargamos el formulario...
      this.videoGameForm.patchValue({
        title: game.title,
        developer: game.developer,
        synopsis: game.synopsis,
        releaseDate: game.releaseDate,
        category: game.category,
        youtubeLink: game.urlTrailer,
        genres: this.mapToCheckboxGroup(this.generosLista, game.genre),
        consoles: this.mapToCheckboxGroup(this.consolasLista, game.platform)
      });
      
      this.videoGameForm.get('image')?.clearValidators();
      this.videoGameForm.get('image')?.updateValueAndValidity();
      this.cdr.detectChanges();
    });
  }

  // Auxiliar para mapear strings a checkboxes
  private mapToCheckboxGroup(lista: string[], value: string) {
    const map: any = {};
    lista.forEach(item => {
      map[item] = value.split(',').includes(item);
    });
    return map;
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.videoGameForm.value;

    // IMPORTANTE: Unimos las URLs de las imágenes que se quedaron (las que no borraste)
    const remainingImages = [];
    
    // Si NO hay foto principal nueva, la vieja sigue siendo la primera
    if (!this.videoGameForm.get('image')?.value && this.currentMainImage) {
      remainingImages.push(this.currentMainImage);
    }
    
    // Añadimos las extras que no fueron eliminadas
    remainingImages.push(...this.currentExtraImages);

    const videoGameData = {
      id: this.gameId, // <--- REVISA QUE ESTO NO SEA NULL
      title: formValue.title,
      releaseDate: formValue.releaseDate,
      synopsis: formValue.synopsis,
      urlTrailer: formValue.youtubeLink, 
      developer: formValue.developer,
      category: formValue.category,
      genre: Object.keys(formValue.genres).filter(k => formValue.genres[k]).join(','),
      platform: Object.keys(formValue.consoles).filter(k => formValue.consoles[k]).join(','),
      urlImages: remainingImages.join(','), // Enviamos la lista de URLs "viejas"
      averageRating: this.videoGame?.averageRating || 0
    };

    formData.append('videoGame', JSON.stringify(videoGameData));

    // Manejo de archivos nuevos
    // Dentro de createFormData()...
    const mainFile = this.videoGameForm.get('image')?.value;
    if (mainFile instanceof File) {
        // Si hay un archivo nuevo, el backend lo recibirá como 'mainImage'
        formData.append('mainImage', mainFile, mainFile.name);
    }

    const extraFiles = this.videoGameForm.get('images')?.value;
    if (extraFiles) {
      for (let i = 0; i < extraFiles.length; i++) {
        formData.append('images', extraFiles[i], extraFiles[i].name);
      }
    }
    console.log("iD del videojuego en FormData:", videoGameData.id);

    return formData;
  }

  // Agrega esta variable arriba
  public newMainPreview: string | null = null;

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      // 1. Marcamos el formulario como modificado (Activa el botón Actualizar)
      this.videoGameForm.get(controlName)?.setValue(input.files);
      this.videoGameForm.markAsDirty();
      this.videoGameForm.get(controlName)?.updateValueAndValidity();

      if (controlName === 'image') {
        const file = input.files[0];
        this.mainImageName = file.name;

        // Previsualización de la IMAGEN PRINCIPAL
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newMainPreview = e.target.result;
          this.cdr.detectChanges(); // Forzamos a Angular a ver el cambio
        };
        reader.readAsDataURL(file);

      } else if (controlName === 'images') {
        this.extraImagesName = `${input.files.length} archivos seleccionados`;
        this.newExtraImagesPreviews = []; // Limpiamos previas anteriores

        // Previsualización de IMÁGENES EXTRA
        Array.from(input.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.newExtraImagesPreviews.push(e.target.result);
            this.cdr.detectChanges(); // Importante para que aparezcan en el HTML
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

}