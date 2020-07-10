import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayGameSelectPage } from './play-game-select.page';

const routes: Routes = [
  {
    path: '',
    component: PlayGameSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayGameSelectPageRoutingModule {}
