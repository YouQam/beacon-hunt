import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBeaconPageRoutingModule } from './add-beacon-routing.module';

import { AddBeaconPage } from './add-beacon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBeaconPageRoutingModule
  ],
  declarations: [AddBeaconPage]
})
export class AddBeaconPageModule {}
