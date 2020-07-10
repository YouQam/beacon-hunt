import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { GameServiceService } from '../services/game-service.service';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, Platform } from '@ionic/angular';
import { BeaconInfo } from 'src/app/models/beaconData'

@Component({
  selector: 'app-map-add-loc',
  templateUrl: './map-add-loc.page.html',
  styleUrls: ['./map-add-loc.page.scss'],
})
export class MapAddLocPage implements OnInit {

  @ViewChild("map") mapContainer;
  map: mapboxgl.Map;

  minorNo: number = 1;
  selectedCoords: number[];
  beaconsStoredList: BeaconInfo[];


  constructor(private changeRef: ChangeDetectorRef, private readonly platform: Platform, public navCtrl: NavController, public storage: Storage, public toastController: ToastController, private gameServ: GameServiceService) {
    platform.resume.subscribe((result) => {
      console.log('Platform Resume Event');
    });
  }

  ngOnInit() {
    // retreive selected beacon minor no from service
    let coordsInService: number[];
    this.gameServ.serviceMinorNo
      .subscribe(data => (this.minorNo = data));
    if (this.minorNo != undefined) {
      console.log('From map-add-loc, sent minor No:', this.minorNo);
    } else {
      console.log('From map-add-loc, minor is undefined');
    }

    // get stored beaconinfo to be update selected beacon location
    this.storage.get('beacon_info_list')
      .then((data) => {
        if (data != null) {
          this.beaconsStoredList = data;
          console.log('2.From add-beacon, beacon info list stored in the variable ', this.beaconsStoredList);
        } else {
          console.log('Storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`Error in retreiving beacon info list from storage`);
      });;
  }

  ionViewWillEnter() {
    mapboxgl.accessToken = environment.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [7.63, 51.960],
      zoom: 12
    });

    /*     this.map.on('zoom', () => {
          console.log(`zoom: `, this.map.getZoom());
        }); */

    // Show coords on map click
    this.map.on('click', e => {
      console.log("e:", e.lngLat)
      this.selectedCoords = [e.lngLat.lng, e.lngLat.lat];
      console.log("this.selectedCoords:", this.selectedCoords)
    });
  }


  saveLocation(): void {
    // update selected beacon location
    if (this.selectedCoords != undefined) {
      // update location of seleted beacon
      for (let i = 0; i < this.beaconsStoredList.length; i++) {
        console.log(' search for minor', this.beaconsStoredList[i].minor);
        console.log(' looking for minor', this.minorNo);

        if (this.beaconsStoredList[i].minor == this.minorNo) {
          this.beaconsStoredList[i].lng = this.selectedCoords[0];
          this.beaconsStoredList[i].lat = this.selectedCoords[1];
          console.log('beacon loaction has been updated');

          this.storage.set('beacon_info_list', this.beaconsStoredList);
          this.changeRef.detectChanges(); // Check for data change to update view Y.Q
        }
      }

      // update MinorNo service to undefined 
      this.gameServ.changeMinorNo(undefined);

      // navigate to previous page
      this.navCtrl.back();

    } else {
      this.presentToast('Please select location on the map to save.');
    }

  }

  // Dispaly toast
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
