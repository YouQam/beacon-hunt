import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanNearbyPage } from './scan-nearby.page';

const routes: Routes = [
  {
    path: '',
    component: ScanNearbyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanNearbyPageRoutingModule {}
