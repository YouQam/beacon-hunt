import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconData';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public beaconinfoList: BeaconInfo[];


  constructor(public storage: Storage, public navCtrl: NavController) { }

  ngOnInit() {
    console.log('menu/onInit');

    if (this.beaconinfoList == undefined) {
      let beaconinfo1: BeaconInfo = new BeaconInfo(56411, 14338, 7.814, 51.675); // hamm
      let beaconinfo2: BeaconInfo = new BeaconInfo(24489, 35011, 8.538, 52.010); // beliefeld
      this.beaconinfoList = [beaconinfo1, beaconinfo2]
      //this.beaconinfoList.push
      this.storage.set('beacon_info_list', this.beaconinfoList); // store in db


      this.storage.length()
      .then((length) => {
        console.log(' Beacon info stored length', length);

      });

      console.log(' Beacon info stored', this.beaconinfoList);

    }else{
      console.log('data is already intialized');
    }
  }

  onPlayGameClicked(): void{
    console.log('PlayGame button pressed');

    // navigate to play-game-select page
    this.navCtrl.navigateForward('play-game-select');
  }

  onPlayClicked(): void {
    console.log('Play button pressed');

    // navigate to home page
    this.navCtrl.navigateForward('home');
  }

  onSettingsClicked(): void {
    console.log('Settings button pressed');

    // navigate to add-beacon page
    this.navCtrl.navigateForward('add-beacon');
  }

  onGameSettingsClicked(): void {
    console.log('Game Settings button pressed');

    // navigate to add-beacon page
    this.navCtrl.navigateForward('game-settings');
  }

  onScanNearbyClicked(): void {
    console.log('Scan Nearby button pressed');

    // navigate to add-beacon page
    this.navCtrl.navigateForward('scan-nearby');
  }

}
