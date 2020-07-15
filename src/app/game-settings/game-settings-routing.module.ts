import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameSettingsPage } from './game-settings.page';

const routes: Routes = [
  {
    path: '',
    component: GameSettingsPage,
    children: [
      {
        path: '',
        redirectTo: 'Play',
        pathMatch: 'full'
      },
      {
        path: 'Play',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../play-game-select/play-game-select.module').then(m => m.PlayGameSelectPageModule)
          }
        ]
      },
      {
        path: 'beacon-scan',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../beacon-scan/beacon-scan.module').then(m => m.BeaconScanPageModule)
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
