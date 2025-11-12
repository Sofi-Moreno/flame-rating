

import { Routes } from '@angular/router';
import { LoginRegister } from './login-register/login-register';
import { ViewProfile } from './view-profile/view-profile';
import { MainMenu } from './main-menu/main-menu';
import { ViewNews } from './view-news/view-news';
import { ViewVideogame } from './view-videogame/view-videogame';
import { CreateVideogame } from './create-videogame/create-videogame';
import { CreateNewsComponent } from './create-news/create-news'; 


export const routes: Routes = [
    { path: 'login-register', component: LoginRegister },
    { path: 'view-profile', component: ViewProfile},
    { path:"", component: MainMenu},
    { path: 'view-news', component: ViewNews},
    { path: 'videogame/:id', component: ViewVideogame},
    {path: 'create-videogame', component: CreateVideogame},
    { path: 'create-news', component: CreateNewsComponent }
];
