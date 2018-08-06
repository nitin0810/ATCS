import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlRoomComponent } from './control-room.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ControlRoomComponent
      }
    ])
  ],
  declarations: [ControlRoomComponent]
})
export class ControlRoomModule { }
