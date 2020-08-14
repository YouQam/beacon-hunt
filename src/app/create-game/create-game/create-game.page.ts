import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BeaconInfo } from '../../models/beaconInfo';
import { Storage } from '@ionic/storage';
import { GameServiceService } from '../../services/game-service.service';
import { Game } from 'src/app/models/game';
import { Task } from 'src/app/models/task';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper-functions.service';


@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.page.html',
  styleUrls: ['./create-game.page.scss'],
})
export class CreateGamePage implements OnInit {

  numTasks: number = 0;
  maxNumTasks: number = 0;
  beaconsStoredList: BeaconInfo[];
  beaconsStoredList_copy: BeaconInfo[];

  gameName: string;
  public tasksList: Task[];

  gameListStored: Game[];

  useGPS: boolean = false;


  constructor(private changeRef: ChangeDetectorRef, public navCtrl: NavController, private gameServ: GameServiceService, public storage: Storage, private apiService: ApiService, private helperService: HelperService) { }

  ngOnInit() {
    console.log('(create-game), ngOnInit');

    // get stored beaconinfo to be update selected beacon location
    this.storage.get('beacon_info_list')
      .then((data) => {
        if (data != null) {
          this.beaconsStoredList = data;
          this.beaconsStoredList_copy = this.beaconsStoredList.slice();
          this.changeRef.detectChanges(); // Check for data change to update view Y.Q
          console.log('From (create-game), beacon info list stored in the variable ', this.beaconsStoredList_copy);

          this.maxNumTasks = this.numTasks = this.beaconsStoredList.length;
          console.log('(create-game), beacon info list retreived successfully: ', this.maxNumTasks);
        } else {
          this.maxNumTasks = 0;
          this.beaconsStoredList_copy = [];
          console.log('(create-game), storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`(create-game), error in retreiving beacon info list from storage`);
      });;

    // Retreive stored games list
    this.retreiveStoredGames();

  }

  ionViewWillEnter() {
    console.log('(create-game), Resume Event');

    this.changeRef.detectChanges(); // Check for data change to update view Y.Q

    // To update view when back to page
    //this.ngOnInit();
    this.UpdateTaskLoaction(); // To update beacon loc when back from map-add-loc 
  }

  retreiveStoredGames() {
    this.storage.get('game_list')
      .then((storedGames) => {
        if (storedGames != null) {
          this.gameListStored = storedGames;
          console.log('(create-game), retreived games list', this.gameListStored);
        } else {
          console.log('(create-game), storage is empty, no games is stored yet');
        }
      }).catch((error: any) => {
        console.error(`(create-game), error in retreiving beacon info list from storage`);

      });
  }

  UpdateTaskLoaction() {
    console.log('(create-game), UpdateTaskLoaction');

    if (this.beaconsStoredList_copy.length < this.beaconsStoredList.length) {
      this.storage.get('beacon_info_list_copy')
        .then((data) => {
          console.log('(create-game), data:', data);

          if (data != null) {
            for (let i = 0; i < this.beaconsStoredList_copy.length; i++) {
              let found = data.filter(t => t.minor == this.beaconsStoredList_copy[i].minor); // Check if the task is already in the list
              //console.log("found is: ", found, ", length: ", found.length);
              if (found.length != 0) {
                this.beaconsStoredList_copy[i].lat = data[i].lat;
                this.beaconsStoredList_copy[i].lng = data[i].lng;
              }
            }
          }
        }).catch((error: any) => {
          console.error(`(create-game), error in retreiving beacon info list from storage`, error);
        });;
    }
  }

  onTaskNumChange(opType: string): void {
    console.log("game name .", this.gameName);

    if (this.numTasks == 1 && opType == "dec") {
      this.helperService.presentToast("There should be at least one task to create a game.", "warning");
      console.log("There should be at least one task to play.");
      return;
    } else if (this.numTasks == this.maxNumTasks && opType == "inc") {
      this.helperService.presentToast("The maximum number of tasks is: " + this.numTasks, "warning");
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

  onUpdateBeaconLocClick(beaconMinor: number, beaconLng: number, beaconLat: number): void {
    console.log("Button: ", beaconMinor, "lng ", beaconLng, beaconLat);

    // sotre in db, before send it to map loc. This will make it esaier to modify the loc in page view issue #87
    this.storage.set('beacon_info_list_copy', this.beaconsStoredList_copy);

    // Store info in service, one to indeicate that this is sent from create-game page , ToDo: improve this impl.
    this.gameServ.changebeaconData(new BeaconInfo(1, beaconMinor, beaconLng, beaconLat));

    /* // update MinorNo service to minor number 
    this.gameServ.changeMinorNo(beaconMinor); */

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('map-add-loc');
  }

  onDeleteBeacon(beaconMinor: number): void {
    if (this.numTasks == 1) {
      this.helperService.presentToast("There should be at least one task to play.", "warning");
      console.log("onDeleteBeacon ,There should be at least one task to create a game.");
      return;
    }

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
        //console.log("(onAddTaskPressed):  task added");
        break; // To make sure that only one task is added at a time

      }
    }
  }

  checkForNameDuplication() {
    console.log("(checkForNameDuplication) ");

    if (this.gameListStored != null) {
      for (let i = 0; i < this.gameListStored.length; i++) {
        if (this.gameListStored[i].name == this.gameName) {
          this.helperService.presentToast("Please, use another name, this name is already used.", "warning");
          return false;
        }
      }
    }

    return true;
  }

  onSaveGameClicked(): void {
    if (this.gameName == undefined || this.gameName.trim() == "") {
      this.helperService.presentToast("Set game name to be able to save.", "warning");
      return;
    }

    if (!this.checkForNameDuplication()) {
      console.log("(checkForNameDuplication), return");
      return;
    }

    this.tasksList = []; // empty tasks list

    for (let i = 0; i < this.beaconsStoredList_copy.length; i++) {
      let task = new Task(i, this.beaconsStoredList_copy[i].minor, [this.beaconsStoredList_copy[i].lng, this.beaconsStoredList_copy[i].lat], this.beaconsStoredList_copy[i].distanceMeter);
      this.tasksList.push(task);
    }

    let gameCreated = new Game(this.gameName, this.useGPS, this.tasksList);

    if (this.gameListStored == null) {
      this.gameListStored = [gameCreated];
    } else {
      this.gameListStored.push(gameCreated); // Add game to the list to store it in local db
    }

    ///*******///
    // Check if there is a network connection to store in server as well as in local storage
    if (navigator.onLine) {
      console.log("onTestServer", 'online');
      this.storage.set('game_list', this.gameListStored); // sotre in local db */

      this.apiService.postGame(gameCreated) // sotre in server in the cloaud */
        .then(data => {
          console.log(data);

          if (data.status == 200) {
            console.log('(postGame), status 200');
            this.helperService.presentToast('Game stored in server and local storage');
          }
        })
        .catch(e => {
          console.error('(postGame), ', e);
          //console.error('(postGame), ', e['error'].message); 
          this.helperService.presentToast('Due to existance in server or failure, game only stored in local storage', "warning");
        });
    } else {
      console.log("onTestServer", 'offline');
      this.storage.set('game_list', this.gameListStored); // sotre in db /
      this.helperService.presentToast('Due to offline mode, beacon info only stored in local storage');
    }

    ///*******///


    console.log("//// Game stored: ", gameCreated);
    console.log("//// Game stored, tasks length: ", gameCreated.tasks.length);


    // Retreive stored games list
    this.storage.get('game_list')
      .then((storedGames) => {
        console.log('/////(create-game), storedGames', storedGames);
      });
  }

  // invoked when user update accuracy to beacon
  onRangeChange(bMinor: number, accuracy: number) {
    console.log("onRangeChange,  bMinor= ", bMinor, 'accuracy', accuracy);

    for (var i = 0; i < this.beaconsStoredList_copy.length; i++) {
      if (this.beaconsStoredList_copy[i].minor == bMinor) {
        this.beaconsStoredList_copy[i].distanceMeter = accuracy;
      }
    }
  }

  // Back button
  onBackButton() {
    this.navCtrl.back();
  }

  useGPSToggleChange() {
    //console.log('toggle change: ', this.useGPS);
  }

}
