import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBeaconPage } from './add-beacon.page';

const routes: Routes = [
  {
    path: '',
    component: AddBeaconPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBeaconPageRoutingModule {}
