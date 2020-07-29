import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconInfo';
import { Task } from '../models/task';
import { Game } from '../models/game';
import { ApiService } from '../services/api.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public beaconinfoList: BeaconInfo[];
  public tasksList: Task[];


  constructor(public platform: Platform, public storage: Storage, public navCtrl: NavController, private apiService: ApiService) { }

  ngOnInit() {
    console.log('menu/onInit');

    if (navigator.onLine) {
      console.log('online');

      this.apiService.getBeaconInfo() // retrieve from server
        .then(data => {
          console.log(data)
          this.beaconinfoList = data;
          console.log(this.beaconinfoList)

          this.storage.set('beacon_info_list', this.beaconinfoList); // store in db
        })
    } else {
      console.log('offline');
    }



    // Initialise in desktop browser for testing  
    /* if (this.platform.is('desktop')) { 
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

      } else {
        console.log('data is already intialized');
      }
    } */
  }

  onPlayClicked(): void {
    console.log('Play button pressed');

    // navigate to home page
    this.navCtrl.navigateForward('play');
  }

  onCreateGameClicked(): void {
    console.log('Create task menu button pressed');

    // navigate to add-beacon page
    this.navCtrl.navigateForward('create-game-menu');
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

  onGameListClicked(): void {
    console.log('Scan Nearby button pressed');

    // navigate to add-beacon page
    this.navCtrl.navigateForward('play-game-list');
  }

}
