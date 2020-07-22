import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoredBeaconListPage } from './stored-beacon-list.page';

const routes: Routes = [
  {
    path: '',
    component: StoredBeaconListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoredBeaconListPageRoutingModule {}
