import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateGameMenuPageRoutingModule } from './create-game-menu-routing.module';

import { CreateGameMenuPage } from './create-game-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateGameMenuPageRoutingModule
  ],
  declarations: [CreateGameMenuPage]
})
export class CreateGameMenuPageModule {}
