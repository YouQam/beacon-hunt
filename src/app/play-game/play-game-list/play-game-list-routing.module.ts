import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayGameListPage } from './play-game-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlayGameListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayGameListPageRoutingModule {}
