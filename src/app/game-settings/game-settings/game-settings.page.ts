import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.page.html',
  styleUrls: ['./game-settings.page.scss'],
})
export class GameSettingsPage implements OnInit {

  constructor( public storage: Storage) { }

  ngOnInit() {
    // get stored beaconinfo to be update selected beacon location
    this.storage.get('test1')
      .then((data) => {
        console.log('// After inster test1: ', data);

        //this.storage.clear();

      });
  }

}
