import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PlayPage } from './play.page';

import { PlayPageRoutingModule } from './play-routing.module';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';


// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayPageRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  declarations: [PlayPage]
})
export class PlayPageModule { }
