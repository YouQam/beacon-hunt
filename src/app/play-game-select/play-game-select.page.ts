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

  ionViewWillEnter() {
    console.log('(play-gme-select), Resume Event');
    this.changeRef.detectChanges(); // Check for data change to update view Y.Q

    // To update view when back to page
    this.ngOnInit();
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
      this.onAddTaskPressed();
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

  // Invoked when user press the increase button
  onAddTaskPressed(): void {
    for (var i = 0; i < this.beaconsStoredList.length; i++) {
      let answer = this.beaconsStoredList_copy.filter(t => t.minor == this.beaconsStoredList[i].minor); // Check if the task is already stored
      console.log("answer is: ", answer, ", length: ", answer.length);
      if(answer.length == 0){
        this.beaconsStoredList_copy.push(this.beaconsStoredList[i]); // add task
      }
    }
  }

}
