import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameSettingsPage } from './game-settings.page';

const routes: Routes = [
  {
    path: '',
    component: GameSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameSettingsPageRoutingModule {}
