import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { GameResults } from '../models/gameResults';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.page.html',
  styleUrls: ['./game-result.page.scss'],
})
export class GameResultPage implements OnInit {


  constructor(public navCtrl: NavController, private apiService: ApiService) { }

  gameResutlsList: GameResults;

  ngOnInit() {
    // Check if there is a network connection to get game results of each task
    if (navigator.onLine) {

      this.apiService.getGameResults() // sotre in server in the cloaud */
        .then(data => {
          //console.log(data);
          this.gameResutlsList = data;
          console.log(this.gameResutlsList);

        })
        .catch(e => {
          console.error('(postGameResult), ', e['error'].message);
          //this.helperService.presentToast('Due to network connection, game results couldn\'t uploaded', "warning");
        });
    } else {
      console.log('Network status', 'offline');
    }
  }

  // Back button
  onBackButton() {
    this.navCtrl.navigateRoot('menu');
  }

}
