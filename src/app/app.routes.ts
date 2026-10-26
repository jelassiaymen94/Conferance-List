import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ConferanceList } from './conferance-list/conferance-list';
import { Notfound } from './notfound/notfound';
import { ConferanceDetails } from './conferance-details/conferance-details';
import { UpdateConferance } from './update-conferance/update-conferance';
import { AddCoferance } from './add-coferance/add-coferance';
import { AddUser } from './add-user/add-user';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'details/:id', component: ConferanceDetails },
  { path: 'update/:id', component: UpdateConferance },
  { path: 'add-conference', component: AddCoferance },
  { path: 'list', component: ConferanceList },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'add', loadComponent: () => import('./add-user/add-user').then(c => c.AddUser) },
  { path: '**', component: Notfound },
];
