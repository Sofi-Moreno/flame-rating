import { Routes } from '@angular/router';
import { LoginRegistro } from './login-registro/login-registro';
import { VerPerfil } from './ver-perfil/ver-perfil';
import { MainMenu } from './main-menu/main-menu';

export const routes: Routes = [
    { path: 'login-registro', component: LoginRegistro }, 
    { path: 'ver-perfil', component: VerPerfil},
    {path:"", component: MainMenu}
];
