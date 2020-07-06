import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GameServiceService } from 'src/app/services/game-service.service';
import { BeaconInfo } from 'src/app/models/beaconData';


@Component({
  selector: 'app-add-beacon',
  templateUrl: './add-beacon.page.html',
  styleUrls: ['./add-beacon.page.scss'],
})
export class AddBeaconPage implements OnInit {

  beaconsStoredList: BeaconInfo[]; // hold stored beacons info to show them in page

  constructor(private changeRef: ChangeDetectorRef,private readonly platform: Platform, private gameServ: GameServiceService, public storage: Storage, public navCtrl: NavController) {
    
  
  }

  ionViewWillEnter() {
    console.log('add-beacon-page Resume Event');
    this.changeRef.detectChanges(); // Check for data change to update view Y.Q

    // To update view when back to page
    this.ngOnInit();
  }

  ngOnInit() {
    // get stored beaconinfo if any
    this.storage.get('beacon_info_list')
      .then((val) => {
        if (val != null) {
          //console.log('1.From add-beacon, beacon info display: ', val.length);
          this.beaconsStoredList = val;
          console.log('2.From add-beacon, beacon info list stored in the variable ', this.beaconsStoredList);
        } else {
          console.log('Storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`Error in retreiving beacon info list from storage`);
      });;

      this.changeRef.detectChanges(); // Check for data change to update view Y.Q


    // get selected coords
    let coordsInService: number[];
    this.gameServ.serviceCoords
      .subscribe(data => (coordsInService = data));
    console.log(' data in service, After update=:', coordsInService);
  }

  navigateHomePage() {
    // get a key/value pair
    this.storage.get('beacon_info_list').then((val) => {
      console.log('From add-beacon, beacon info display: ', val);
    });

    this.navCtrl.navigateForward('home');
  }

  openBeaconData(beaconMinor: number): void {
    console.log("Button: ", beaconMinor)

    // update MinorNo service to minor number 
    this.gameServ.changeMinorNo(beaconMinor);

    // navigate to map-add-loc page
    this.navCtrl.navigateForward('map-add-loc');

  }

}
