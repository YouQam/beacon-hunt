import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanNearbyPageRoutingModule } from './scan-nearby-routing.module';

import { ScanNearbyPage } from './scan-nearby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanNearbyPageRoutingModule
  ],
  declarations: [ScanNearbyPage]
})
export class ScanNearbyPageModule {}
