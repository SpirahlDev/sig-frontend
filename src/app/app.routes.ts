import { Routes } from '@angular/router';
import { SitesExplorer } from './features/sites-explorer/sites-explorer';

export const routes: Routes = [
    {path:"",pathMatch:"full",component:SitesExplorer}
];
