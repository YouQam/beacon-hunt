import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-game-menu',
  templateUrl: './create-game-menu.page.html',
  styleUrls: ['./create-game-menu.page.scss'],
})
export class CreateGameMenuPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  // Back button
  onBackButton() {
    this.navCtrl.back();
  }

  onGameCreattTaskClicked(): void {
    console.log('Create task button pressed');

    // navigate to home page
    this.navCtrl.navigateForward('create-game');
  }

  onUpdateTaskClicked(): void {
    console.log('Update button pressed');

    // navigate to home page
    this.navCtrl.navigateForward('update-game-list');
  }

}
