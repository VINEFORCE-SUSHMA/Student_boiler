import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [StudentsComponent],
    imports: [
        SharedModule,
        StudentsRoutingModule,
        CommonModule
    ],
})
export class StudentsModule {}
