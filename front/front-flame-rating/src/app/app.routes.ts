import { Routes } from '@angular/router';
import { LoginRegistro } from './login-registro/login-registro';
import { VerPerfil } from './ver-perfil/ver-perfil';

export const routes: Routes = [
    { path: 'login-registro', component: LoginRegistro }, 
    { path: 'ver-perfil', component: VerPerfil}
];
