import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Game } from 'src/app/models/game';
import { GameServiceService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-play-game-list',
  templateUrl: './play-game-list.page.html',
  styleUrls: ['./play-game-list.page.scss'],
})
export class PlayGameListPage implements OnInit {
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

  // Back button
  onBackButton(): void {
    this.navCtrl.back();
  }

  gameClick(game: any): void {
    // Store Game in service
    this.gameServ.ChangeGame(game);

    console.log('(play-game-list) game to store to service', game)

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('play');

  }

}
