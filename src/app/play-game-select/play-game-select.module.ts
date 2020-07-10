import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayGameSelectPageRoutingModule } from './play-game-select-routing.module';

import { PlayGameSelectPage } from './play-game-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayGameSelectPageRoutingModule
  ],
  declarations: [PlayGameSelectPage]
})
export class PlayGameSelectPageModule {}
