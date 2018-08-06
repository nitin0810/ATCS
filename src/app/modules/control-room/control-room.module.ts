import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../header/header.module';

import { ControlRoomComponent } from './control-room.component';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule.forChild([
      {
        path: '',
        component: ControlRoomComponent
      }
    ])
  ],
  declarations: [
    ControlRoomComponent,
  ]
})
export class ControlRoomModule { }
