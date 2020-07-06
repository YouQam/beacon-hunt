import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapAddLocPageRoutingModule } from './map-add-loc-routing.module';

import { MapAddLocPage } from './map-add-loc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapAddLocPageRoutingModule
  ],
  declarations: [MapAddLocPage]
})
export class MapAddLocPageModule {}
