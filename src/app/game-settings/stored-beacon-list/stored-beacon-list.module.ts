import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoredBeaconListPageRoutingModule } from './stored-beacon-list-routing.module';

import { StoredBeaconListPage } from './stored-beacon-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoredBeaconListPageRoutingModule
  ],
  declarations: [StoredBeaconListPage]
})
export class StoredBeaconListPageModule {}
