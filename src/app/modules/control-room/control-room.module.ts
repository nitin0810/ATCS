import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderModule } from '../header/header.module';

import { ControlRoomComponent } from './control-room.component';

@NgModule({
  imports: [
    // CommonModule,
    HeaderModule,
    FormsModule,
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
