import { Routes } from '@angular/router';
import { LoginComponent } from './Core/Pages/login/login.component';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'home',
        loadChildren: () => import('./Core/Pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path:'**',
        redirectTo: ''
    }
];
