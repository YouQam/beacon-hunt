import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconInfo';
import { Task } from '../models/task';
import { Game } from '../models/game';
import { ApiService } from '../services/api.service';
import { HelperService } from '../services/helper-functions.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public beaconinfoList: BeaconInfo[];
  public gamesList: Game[];


  constructor(public platform: Platform, public storage: Storage, public navCtrl: NavController, private apiService: ApiService, private helperService: HelperService) { }

  ngOnInit() {
    console.log('menu/onInit');

    if (navigator.onLine) {
      console.log('online');

      // retrieve beacon info from server
      this.apiService.getBeaconInfo()
        .then(data => {
          this.beaconinfoList = data;
          console.log('beaconinfoList: ', this.beaconinfoList.length)
          if (this.beaconinfoList.length > 0) {
            this.storage.set('beacon_info_list', this.beaconinfoList); // store in db
          }
        })

      // retrieve beacon info from server
      this.apiService.getGame()
        .then(data => {
          this.gamesList = data;
          console.log('gamesList: ', this.gamesList.length)
          if (this.gamesList.length > 0) {
            this.storage.set('game_list', this.gamesList); // store in db
          }
        })

    } else { // get beacon info from local stoegae in case there is no internet connection
      console.log('offline');
      this.helperService.presentToast('Due to offline mode, data retrieved from local storage.');
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
