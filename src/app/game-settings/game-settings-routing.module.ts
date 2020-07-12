import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameSettingsPage } from './game-settings.page';

const routes: Routes = [
  {
    path: '',
    component: GameSettingsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../play-game-select/play-game-select.module').then(m => m.PlayGameSelectPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameSettingsPageRoutingModule { }
