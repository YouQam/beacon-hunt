import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTaskMenuPage } from './create-task-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTaskMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTaskMenuPageRoutingModule {}
