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
  extraImagesName: string = 'Cambiar imágenes extra...';
  public currentMainImage: string = '';
  public currentExtraImages: string[] = [];
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

  private loadGameData() {
    this.videogameService.findById(this.gameId).subscribe(game => {
      // 1. Separar las URLs que vienen en el string (ej: "url1,url2,url3")
      const imagesArray = game.urlImages ? game.urlImages.split(',') : [];
      
      // 2. La primera suele ser la principal, las demás las extras
      this.currentMainImage = imagesArray[0] || '';
      this.currentExtraImages = imagesArray.slice(1);

      // 3. Quitar el validador 'required' de la imagen
      // Como ya tiene imagen, no es obligatorio subir una nueva
      this.videoGameForm.get('image')?.clearValidators();
      this.videoGameForm.get('image')?.updateValueAndValidity();
      
      // MAPEAMOS GÉNEROS: El string "Accion,Terror" se vuelve objeto {Accion: true, Terror: true}
      const genresMap: any = {};
      this.generosLista.forEach(g => {
        genresMap[g] = game.genre.split(',').includes(g);
      });

      // MAPEAMOS CONSOLAS
      const consolesMap: any = {};
      this.consolasLista.forEach(c => {
        consolesMap[c] = game.platform.split(',').includes(c);
      });

      // Precargamos el formulario
      this.videoGameForm.patchValue({
        title: game.title,
        developer: game.developer,
        synopsis: game.synopsis,
        releaseDate: game.releaseDate,
        category: game.category,
        youtubeLink: game.urlTrailer,
        genres: genresMap,
        consoles: consolesMap
      });
      
      this.cdr.detectChanges();
    });
  }

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
        next: (videojuegoEditado) => {
          console.log('¡Videojuego editado con éxito!', videojuegoEditado);
          this.router.navigate(['/videogame', videojuegoEditado.id]); 
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

  // --- ¡¡¡FUNCIÓN onFileChange MODIFICADA!!! ---
  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let fileToStore = null;

    if (input.files && input.files.length > 0) {
      if (controlName === 'images') {
        // --- LÓGICA PARA MÚLTIPLES ARCHIVOS ---
        fileToStore = input.files;
        // ¡NUEVO! Actualiza el texto del label
        this.extraImagesName = `${input.files.length} archivos seleccionados`;
      
      } else {
        // --- LÓGICA PARA UN SOLO ARCHIVO ---
        fileToStore = input.files[0];
        // ¡NUEVO! Actualiza el texto del label
        this.mainImageName = input.files[0].name; 
      }
    } else {
      fileToStore = null;
      if (controlName === 'images') {
        this.extraImagesName = 'Seleccionar archivos...';
      } else {
        this.mainImageName = 'Seleccionar archivo...';
      }
    }

    // "Parcheamos" el valor (el archivo o null) en el FormGroup
    this.videoGameForm.patchValue({
      [controlName]: fileToStore
    });
    // Marcamos como "tocado" para que muestre errores si es necesario
    this.videoGameForm.get(controlName)?.markAsTouched();
    
    console.log(`Archivo guardado en el formControl '${controlName}':`, fileToStore);
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

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.videoGameForm.value;

    const selectedGenres = Object.keys(formValue.genres)
      .filter(key => formValue.genres[key] === true) 
      .join(','); 

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

    const extraImagesFiles = this.videoGameForm.get('images')?.value;
    if (extraImagesFiles) {
      for (let i = 0; i < extraImagesFiles.length; i++) {
        formData.append(
          'images', 
          extraImagesFiles[i],
          extraImagesFiles[i].name
        );
      }
    }
    
    console.log('--- FormData a enviar ---');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    console.log('-------------------------');

    return formData;
  }
}
