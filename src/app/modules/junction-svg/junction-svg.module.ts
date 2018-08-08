import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JunctionSVGComponent } from './junction-svg.component';


@NgModule({
    imports: [CommonModule],
    declarations: [
        JunctionSVGComponent,
    ],
    exports: [JunctionSVGComponent]
})
export class JunctionSVGModule { }
