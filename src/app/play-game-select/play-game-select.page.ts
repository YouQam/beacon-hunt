import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { BeaconInfo } from '../models/beaconData';
import { Storage } from '@ionic/storage';
import { GameServiceService } from '../services/game-service.service';

@Component({
  selector: 'app-play-game-select',
  templateUrl: './play-game-select.page.html',
  styleUrls: ['./play-game-select.page.scss'],
})
export class PlayGameSelectPage implements OnInit {

  numTasks: number = 1;
  maxNumTasks: number = 0;
  beaconsStoredList: BeaconInfo[];
  beaconsStoredList_copy: BeaconInfo[];


  constructor(public navCtrl: NavController, private gameServ: GameServiceService, public toastController: ToastController, public storage: Storage) { }

  ngOnInit() {
    // get stored beaconinfo to be update selected beacon location
    this.storage.get('beacon_info_list')
      .then((data) => {
        if (data != null) {
          this.beaconsStoredList = data;
          this.beaconsStoredList_copy = this.beaconsStoredList.slice();
          this.maxNumTasks = this.numTasks = this.beaconsStoredList.length;
          console.log('(play-game-select), beacon info list retreived successfully');
          console.log('(play-game-select), Max num of tasks is: ', this.maxNumTasks);
        } else {
          console.log('(play-game-select), storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`(play-game-select), error in retreiving beacon info list from storage`);
      });;
  }

  onTaskNumChange(opType: string): void {
    if (this.numTasks == 1 && opType == "dec") {
      this.presentToast("There should be at least one task to play.");
      console.log("There should be at least one task to play.");
      return;
    } else if (this.numTasks == this.maxNumTasks && opType == "inc") {
      this.presentToast("The maximum number of tasks is: " + this.numTasks);
      console.log("The maximum number of tasks is: ", this.numTasks);
      return;
    }

    if (opType == "inc") {
      this.numTasks += 1;
      this.beaconsStoredList_copy.push(this.beaconsStoredList[this.beaconsStoredList_copy.length]); // add task
      console.log(" Num: ", this.numTasks);
    } else {
      this.numTasks -= 1;
      this.beaconsStoredList_copy.pop(); // Remove task
      console.log(" Num: ", this.numTasks);
    }
  }

  // Dispaly toast
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  openBeaconData(beaconMinor: number): void {
    console.log("Button: ", beaconMinor)

    // update MinorNo service to minor number 
    this.gameServ.changeMinorNo(beaconMinor);

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('map-add-loc');
  }

}
