import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateGameListPage } from './update-game-list.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateGameListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateGameListPageRoutingModule {}
