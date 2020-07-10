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
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'play-game-select',
    loadChildren: () => import('./play-game-select/play-game-select.module').then( m => m.PlayGameSelectPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
