import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainMenu } from "./main-menu/main-menu";
import { Encabezado } from "./encabezado/encabezado";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado,MainMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-flame-rating');
}
