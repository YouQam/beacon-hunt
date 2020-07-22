import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameSettingsPageRoutingModule } from './game-settings-routing.module';

import { GameSettingsPage } from './game-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameSettingsPageRoutingModule
  ],
  declarations: [GameSettingsPage]
})
export class GameSettingsPageModule {}
