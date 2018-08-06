import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const rootRutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'control-room',
    loadChildren: 'app/modules/control-room/control-room.module#ControlRoomModule'
  }, {
    path: '',
    redirectTo: 'control-room',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(rootRutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
