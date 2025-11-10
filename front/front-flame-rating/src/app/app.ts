import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { MainMenu } from "./components/main-menu/main-menu";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainMenu],
=======
import { Encabezado } from "./encabezado/encabezado";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado],
>>>>>>> 7d7294f9b2edc80c3725047861581a8b560e95a3
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-flame-rating');
}
