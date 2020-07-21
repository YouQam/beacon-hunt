import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.page.html',
  styleUrls: ['./update-game.page.scss'],
})
export class UpdateGamePage implements OnInit {
  gameList: Game[] = [];

  constructor(public storage: Storage, public navCtrl: NavController) { }

  ngOnInit() {
    // Retreive stored games list
    this.storage.get('game_list')
      .then((data) => {
        this.gameList = data;

        console.log('stored games', data);
      });
  }

  ionViewWillLeave() {
    this.storage.set('game_list', this.gameList);
    console.log('Games list upstated successfully');
  }

  // Back button
  onBackButton(): void {
    this.navCtrl.back();
  }

  onDeleteGame(gameName: string){
    console.log('Game name', gameName);

    for (var i = 0; i < this.gameList.length; i++) {
      if (this.gameList[i].name == gameName) {
        this.gameList.splice(i, 1);
      }
    }
  }

}
