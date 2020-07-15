import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTaskMenuPageRoutingModule } from './create-task-menu-routing.module';

import { CreateTaskMenuPage } from './create-task-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTaskMenuPageRoutingModule
  ],
  declarations: [CreateTaskMenuPage]
})
export class CreateTaskMenuPageModule {}
