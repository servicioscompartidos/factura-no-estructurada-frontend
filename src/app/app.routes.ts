import { Routes } from '@angular/router';
import { LoginComponent } from './Core/Pages/login/login.component';
import { adminGuard } from './Core/Guards/admin.guard';

export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path:'home',
        canActivate: [adminGuard],
        loadChildren: () => import('./Core/Pages/home/home.module').then(m => m.HomeModule)
    },
    {
        path:'**',
        redirectTo: ''
    }
];
