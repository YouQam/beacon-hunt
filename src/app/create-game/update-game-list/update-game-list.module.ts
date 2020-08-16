import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateGameListPageRoutingModule } from './update-game-list-routing.module';

import { UpdateGameListPage } from './update-game-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateGameListPageRoutingModule
  ],
  declarations: [UpdateGameListPage]
})
export class UpdateGameListPageModule {}
