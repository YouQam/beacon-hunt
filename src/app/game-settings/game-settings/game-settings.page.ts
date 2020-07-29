import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.page.html',
  styleUrls: ['./game-settings.page.scss'],
})
export class GameSettingsPage implements OnInit {

  constructor( public storage: Storage) { }

  ngOnInit() {
    
  }

}
