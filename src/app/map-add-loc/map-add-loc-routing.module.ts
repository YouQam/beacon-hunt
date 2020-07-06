import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapAddLocPage } from './map-add-loc.page';

const routes: Routes = [
  {
    path: '',
    component: MapAddLocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapAddLocPageRoutingModule {}
