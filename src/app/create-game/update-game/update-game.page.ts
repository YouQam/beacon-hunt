import { Component, OnInit } from '@angular/core';
import { GameServiceService } from 'src/app/services/game-service.service';
import { Game } from 'src/app/models/game';
import { Task } from 'src/app/models/task';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconInfo';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.page.html',
  styleUrls: ['./update-game.page.scss'],
})
export class UpdateGamePage implements OnInit {


  constructor(private gameServ: GameServiceService, public navCtrl: NavController, public storage: Storage) { }

  selectedGame: Game;
  tasksList: Task[];
  gameName: string;
  taskList_BI: BeaconInfo[];
  updatedTasksList: Task[];
  gameListStored: Game[];


  ngOnInit() {
    console.log("(UpdateGamePage), ngOnInit");

    // Retrteive game to be updated
    this.gameServ.serviceSelectedGame
      .subscribe(selGame => (this.selectedGame = selGame));
    console.log('◊◊◊ (updte-game) sent game :', this.selectedGame);

    if (this.selectedGame != undefined) {
      this.gameName = this.selectedGame.name;
      this.tasksList = this.selectedGame.tasks;
      this.convertTobeaconInfo();

      console.log('◊◊◊ (update-game-page) convertTobeaconInfo :', this.taskList_BI);

      console.log('◊◊◊ (update-game) tasks :', this.tasksList);
    } else {
      console.log('◊◊◊ (play) game is undefined');
    }

    // Retreive stored games list
    this.retreiveStoredGames();
  }

  convertTobeaconInfo() {
    for (var i = 0; i < this.tasksList.length; i++) {

      if (this.taskList_BI == undefined) {
        this.taskList_BI = [new BeaconInfo(null, this.tasksList[i].minor, this.tasksList[i].coords[0], this.tasksList[i].coords[1], this.tasksList[i].distanceMeter)];
        continue;
      }

      this.taskList_BI.push(new BeaconInfo(null, this.tasksList[i].minor, this.tasksList[i].coords[0], this.tasksList[i].coords[1], this.tasksList[i].distanceMeter));
    }
  }

  ionViewWillEnter() {
    console.log("(UpdateGamePage),ionViewWillEnter");
    this.UpdateTaskLoaction();
  }

  ionViewWillLeave() {
    this.storage.remove('update-game-list');
    console.log("(UpdateGamePage), ionViewWillLeave");

  }

  UpdateTaskLoaction() {
    console.log('(update-game), UpdateTaskLoaction');
    this.storage.get('update-game-list')
      .then((data) => {
        console.log('(update-game), data:', data);

        if (data != null) {
          for (let i = 0; i < this.taskList_BI.length; i++) {
            let found = data.filter(t => t.minor == this.taskList_BI[i].minor); // Check if the task is already in the list
            //console.log("found is: ", found, ", length: ", found.length);
            if (found.length != 0) {
              this.taskList_BI[i].lat = data[i].lat;
              this.taskList_BI[i].lng = data[i].lng;
            } else {
              console.log('Storage is empty, no beacon info is stored yet');
            }
          }
        }
      }).catch((error: any) => {
        console.error(`(update-game), error in retreiving beacon info list from storage`, error);
      });;
  }

  retreiveStoredGames() {
    this.storage.get('game_list')
      .then((storedGames) => {
        if (storedGames != null) {
          this.gameListStored = storedGames;
          console.log('(update-game), retreived games list', this.gameListStored);
        } else {
          console.log('(create-game), storage is empty, no games is stored yet');
        }
      }).catch((error: any) => {
        console.error(`(create-game), error in retreiving beacon info list from storage`);

      });
  }

  // Back button
  onBackButton(): void {
    this.navCtrl.back();
  }

  onUpdateBeaconLocClick(beaconMinor: number, beaconLng: number, beaconLat: number, targetDistance: number): void {
    console.log("(onUpdateBeaconLocClick), Button: ", beaconMinor, "lng ", beaconLng, beaconLat, targetDistance);

    // sotre in db, before send it to map loc. This will make it esaier to modify the loc in page view issue #87
    this.storage.set('update-game-list', this.taskList_BI);

    // Store info in service, one to indeicate that this is sent from create-game page , ToDo: improve this impl.
    this.gameServ.changebeaconData(new BeaconInfo(2, beaconMinor, beaconLng, beaconLat, targetDistance));

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('map-add-loc'); /**/
  }

  // invoked when user update target accuracy of beacon
  onRangeChange(bMinor: number, accuracy: number) {
    console.log("onRangeChange,  bMinor= ", bMinor, 'accuracy', accuracy);

    for (var i = 0; i < this.taskList_BI.length; i++) {
      if (this.taskList_BI[i].minor == bMinor) {
        this.taskList_BI[i].distanceMeter = accuracy;
      }
    }
  }

  onSaveGameClicked(): void {
    this.updatedTasksList = []; // empty tasks list

    for (let i = 0; i < this.taskList_BI.length; i++) {
      let task = new Task(i, this.taskList_BI[i].minor, [this.taskList_BI[i].lng, this.taskList_BI[i].lat], this.taskList_BI[i].distanceMeter);
      this.updatedTasksList.push(task);
    }

    console.log("Updated tasks: ", this.updatedTasksList);

    let gameIndex = this.gameListStored.findIndex(x => x.name == this.gameName); // Get index of game


    console.log("gameIndex: ", gameIndex);

    this.selectedGame.tasks = this.updatedTasksList;
    this.gameListStored[gameIndex] = this.selectedGame;

    console.log("selectedGame: ", this.selectedGame);
    console.log("gameListStored: ", this.gameListStored);


    //let gameCreated = new Game(this.gameName, this.useGPS, this.tasksList);

/*     if (this.gameListStored == null) {
      this.gameListStored = [gameCreated];
    } else {
      this.gameListStored.push(gameCreated); // Add game to the list to store it in local db
    } */

    ///*******///
    // Check if there is a network connection to store in server as well as in local storage
    /* if (navigator.onLine) {
      console.log("onTestServer", 'online');
      this.storage.set('game_list', this.gameListStored); // sotre in local db/ ToDo: put it inside success

      this.apiService.postGame(gameCreated) // sotre in server in the cloaud /
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
    } else { */
      console.log("onTestServer", 'offline');
      this.storage.set('game_list', this.gameListStored); // sotre in db /
      //this.helperService.presentToast('Due to offline mode, beacon info only stored in local storage');
    //}

    ///*******///


    /* console.log("//// Game stored: ", gameCreated);
    console.log("//// Game stored, tasks length: ", gameCreated.tasks.length);


    // Retreive stored games list
    this.storage.get('game_list')
      .then((storedGames) => {
        console.log('/////(create-game), storedGames', storedGames);
      }); */

      // Navigate to update game list page
      this.onBackButton();
  }

}
