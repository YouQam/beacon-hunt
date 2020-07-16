import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { BeaconInfo } from '../../models/beaconData';
import { Storage } from '@ionic/storage';
import { GameServiceService } from '../../services/game-service.service';
import { Game } from 'src/app/models/game';
import { Task } from 'src/app/models/task';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit {

  numTasks: number = 0;
  maxNumTasks: number = 0;
  beaconsStoredList: BeaconInfo[];
  beaconsStoredList_copy: BeaconInfo[];

  gameName: string = "Game_1";
  public tasksList: Task[];


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
          this.maxNumTasks = 0;
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
    //this.ngOnInit();
    this.UpdateTaskLoaction();
  }

  UpdateTaskLoaction() {
    this.storage.get('beacon_info_list')
      .then((data) => {
        if (data != null) {
          for (let i = 0; i < this.beaconsStoredList_copy.length; i++) {
            let found = data.filter(t => t.minor == this.beaconsStoredList_copy[i].minor); // Check if the task is already in the list
            console.log("found is: ", found, ", length: ", found.length);
            if (found.length != 0) {
              this.beaconsStoredList_copy[i] = data[i];
            }

          }
        }
      }).catch((error: any) => {
        console.error(`(play-game-select), error in retreiving beacon info list from storage`);
      });;

  }

  onTaskNumChange(opType: string): void {
    console.log("game name .", this.gameName);


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
      if (answer.length == 0) {
        this.beaconsStoredList_copy.push(this.beaconsStoredList[i]); // add task
      }
    }
  }

  onSaveGameClicked(): void {
    this.tasksList = []; // empty tasks list
    for(let i=0; i<this.beaconsStoredList_copy.length; i++){
      let task = new Task(1, this.beaconsStoredList_copy[i].minor, [this.beaconsStoredList_copy[i].lng, this.beaconsStoredList_copy[i].lat]);
      this.tasksList.push(task);
    }

    let gameCreated = new Game(this.gameName, this.tasksList);

    console.log("//// Game stored: ", gameCreated);
    console.log("//// Game stored, tasks length: ", gameCreated.tasks.length);


    //store tasks in DB
    this.storage.set('tasks_list', gameCreated); // store in db

  }

}
