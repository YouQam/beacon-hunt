import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  numTasks: number = 0;
  maxNumTasks: number = 0;
  beaconsStoredList: BeaconInfo[];
  beaconsStoredList_copy: BeaconInfo[];


  constructor(private changeRef: ChangeDetectorRef, public navCtrl: NavController, private gameServ: GameServiceService, public toastController: ToastController, public storage: Storage) { }

  ngOnInit() {
    // get stored beaconinfo to be update selected beacon location
    this.storage.get('beacon_info_list')
      .then((data) => {
        if (data != null) {
          this.beaconsStoredList = data;
          this.beaconsStoredList_copy = this.beaconsStoredList.slice();
          this.changeRef.detectChanges(); // Check for data change to update view Y.Q
          console.log('From (play-game-select), beacon info list stored in the variable ', this.beaconsStoredList_copy);

          this.maxNumTasks = this.numTasks = this.beaconsStoredList.length;
          console.log('(play-game-select), beacon info list retreived successfully: ', this.maxNumTasks);
        } else {
          this.maxNumTasks = this.numTasks = 0;
          this.beaconsStoredList_copy = [];
          console.log('(play-game-select), storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`(play-game-select), error in retreiving beacon info list from storage`);
      });;
  }

  ionViewWillEnter() {
    console.log('(play-gme-select), Resume Event');

    this.changeRef.detectChanges(); // Check for data change to update view Y.Q

    // To update view when back to page
    this.ngOnInit();
  }

  // Dispaly toast
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  openUpdateBeaconLoc(beaconMinor: number, beaconLng: number, beaconLat: number): void {
    console.log("Button: ", beaconMinor, "lng ", beaconLng, beaconLat);

    // Store info in service
    this.gameServ.changebeaconData(new BeaconInfo(null, beaconMinor, beaconLng, beaconLat));

    // update MinorNo service to minor number 
    this.gameServ.changeMinorNo(beaconMinor);

    // navigate to map-add-loc page
    this.navCtrl.navigateRoot('map-add-loc'); // Used navigateRoot to be able to update coords in tab
  }

  onDeleteBeacon(beaconMinor: number): void {
    for (var i = 0; i < this.beaconsStoredList_copy.length; i++) {
      if (this.beaconsStoredList_copy[i].minor == beaconMinor) {
        this.beaconsStoredList_copy.splice(i, 1);
        this.onUpdateTasksNum();
        console.log("Deleted successfully!");
      }
    }
  }

  onUpdateTasksNum(): void {
    this.numTasks -= 1;
  }

/*   // Invoked when user press the increase button
  onAddTaskPressed(): void {
    for (var i = 0; i < this.beaconsStoredList.length; i++) {
      let answer = this.beaconsStoredList_copy.filter(t => t.minor == this.beaconsStoredList[i].minor); // Check if the task is already stored
      console.log("answer is: ", answer, ", length: ", answer.length);
      if(answer.length == 0){
        this.beaconsStoredList_copy.push(this.beaconsStoredList[i]); // add task
      }
    }
  } */

}
