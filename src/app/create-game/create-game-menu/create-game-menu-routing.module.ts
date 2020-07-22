import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateGameMenuPage } from './create-game-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CreateGameMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateGameMenuPageRoutingModule {}
