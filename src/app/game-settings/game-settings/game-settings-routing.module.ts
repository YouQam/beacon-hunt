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
        redirectTo: 'stored-beacon-list',
        pathMatch: 'full'
      },
      {
        path: 'stored-beacon-list',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../stored-beacon-list/stored-beacon-list.module').then(m => m.StoredBeaconListPageModule)
          }
        ]
      },
      {
        path: 'add-beacon',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../add-beacon/add-beacon.module').then(m => m.AddBeaconPageModule)
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
