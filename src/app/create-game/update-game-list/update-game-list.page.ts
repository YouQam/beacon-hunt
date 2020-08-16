import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Game } from 'src/app/models/game';
import { GameServiceService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-update-game-list',
  templateUrl: './update-game-list.page.html',
  styleUrls: ['./update-game-list.page.scss'],
})
export class UpdateGameListPage implements OnInit {
  gameList: Game[] = [];

  constructor(public storage: Storage, public navCtrl: NavController, private gameServ: GameServiceService) { }

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

  onDeleteGameClicked(gameName: string) {
    console.log('Game name', gameName);

    for (var i = 0; i < this.gameList.length; i++) {
      if (this.gameList[i].name == gameName) {
        this.gameList.splice(i, 1);
      }
    }
  }

  onGameClicked(game: any) {
    console.log('Game name', game.name);

    // Store Game in service
    this.gameServ.ChangeGame(game);

    console.log('(update-game-list) store game in service', game)

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('update-game');
  }

}
