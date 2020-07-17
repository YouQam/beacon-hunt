import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayGameListPageRoutingModule } from './play-game-list-routing.module';

import { PlayGameListPage } from './play-game-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayGameListPageRoutingModule
  ],
  declarations: [PlayGameListPage]
})
export class PlayGameListPageModule {}
