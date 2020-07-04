import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-add-beacon',
  templateUrl: './add-beacon.page.html',
  styleUrls: ['./add-beacon.page.scss'],
})
export class AddBeaconPage implements OnInit {

  constructor(public storage: Storage, public navCtrl: NavController) { }

  ngOnInit() {
  }

  navigateHomePage() {
    // get a key/value pair
    this.storage.get('name').then((val) => {
      console.log('from add-beacon :Your name is', val);
    });

    this.navCtrl.navigateForward('home');
  }

}
