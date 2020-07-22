import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'add-beacon',
    loadChildren: () => import('./handle-beacons/add-beacon/add-beacon.module').then(m => m.AddBeaconPageModule)
  }, {
    path: 'map-add-loc',
    loadChildren: () => import('./map-add-loc/map-add-loc.module').then(m => m.MapAddLocPageModule)
  },
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then(m => m.PlayPageModule)
  },
  {
    path: 'stored-beacon-list',
    loadChildren: () => import('./game-settings/stored-beacon-list/stored-beacon-list.module').then( m => m.StoredBeaconListPageModule)
  },
  {
    path: 'game-settings',
    loadChildren: () => import('./game-settings/game-settings/game-settings.module').then( m => m.GameSettingsPageModule)
  },
  {
    path: 'add-beacon',
    loadChildren: () => import('./game-settings/add-beacon/add-beacon.module').then( m => m.AddBeaconPageModule)
  },
  {
    path: 'scan-nearby',
    loadChildren: () => import('./scan-nearby/scan-nearby.module').then( m => m.ScanNearbyPageModule)
  },
  {
    path: 'create-task-menu',
    loadChildren: () => import('./create-task/create-task-menu/create-task-menu.module').then( m => m.CreateTaskMenuPageModule)
  },
  {
    path: 'create-task',
    loadChildren: () => import('./create-task/create-task/create-task.module').then( m => m.CreateTaskPageModule)
  },
  {
    path: 'play-game-list',
    loadChildren: () => import('./play-game/play-game-list/play-game-list.module').then( m => m.PlayGameListPageModule)
  },
  {
    path: 'update-game',
    loadChildren: () => import('./create-task/update-game/update-game.module').then( m => m.UpdateGamePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
