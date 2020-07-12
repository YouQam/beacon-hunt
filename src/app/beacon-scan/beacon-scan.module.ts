import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeaconScanPageRoutingModule } from './beacon-scan-routing.module';

import { BeaconScanPage } from './beacon-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeaconScanPageRoutingModule
  ],
  declarations: [BeaconScanPage]
})
export class BeaconScanPageModule {}
