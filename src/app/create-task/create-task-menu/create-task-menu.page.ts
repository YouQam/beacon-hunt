import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-task-menu',
  templateUrl: './create-task-menu.page.html',
  styleUrls: ['./create-task-menu.page.scss'],
})
export class CreateTaskMenuPage implements OnInit {

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
    this.navCtrl.navigateForward('create-task');
  }

  onUpdateTaskClicked(): void {
    console.log('Update button pressed');

    // navigate to home page
    this.navCtrl.navigateForward('update-game');
  }

}
