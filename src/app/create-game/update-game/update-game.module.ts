import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateGamePageRoutingModule } from './update-game-routing.module';

import { UpdateGamePage } from './update-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateGamePageRoutingModule
  ],
  declarations: [UpdateGamePage]
})
export class UpdateGamePageModule {}
