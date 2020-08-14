import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { GameServiceService } from '../services/game-service.service';
import { Storage } from '@ionic/storage';
import { NavController, Platform } from '@ionic/angular';
import { BeaconInfo } from 'src/app/models/beaconInfo'
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationService } from '../services/location.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../services/helper-functions.service';
import { ApiService } from '../services/api.service';

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

  beaconDataSer: BeaconInfo;

  marker: mapboxgl.Marker;

  marker2: mapboxgl.Marker; // for test
  coords: [number, number];

  positionSubscription: Subscription;

  db_name: string; // To hold info list db name, either original or copy


  constructor(public locationServics: LocationService, private geolocation: Geolocation, private changeRef: ChangeDetectorRef, private readonly platform: Platform, public navCtrl: NavController, public storage: Storage, private gameServ: GameServiceService, private helperService: HelperService, private apiService: ApiService) {
    platform.resume.subscribe((result) => {
      console.log('Platform Resume Event');
    });
  }

  ngOnInit() {
    // retreive selected beacon info from service
    this.gameServ.serviceBeaconData
      .subscribe(data => (this.beaconDataSer = data));
    if (this.beaconDataSer != undefined) {
      console.log('◊◊◊ From map-add-loc, sent beacon data :', this.beaconDataSer);
    } else {
      console.log('◊◊◊ From map-add-loc, beacon data is undefined');
    }

    console.log('(Page-num: )', this.beaconDataSer.major);
    if (this.beaconDataSer.major == 0) {
      this.db_name = 'beacon_info_list'
    } else {
      this.db_name = 'beacon_info_list_copy'
    }

    // get stored beaconinfo to be update selected beacon location
    this.storage.get(this.db_name)
      .then((data) => {
        if (data != null) {
          this.beaconsStoredList = data;
          console.log('2.From add-beacon, beacon info list stored in the variable ', this.beaconsStoredList);
        } else {
          console.log('Storage is empty, no beacon info is stored yet');
        }
      }).catch((error: any) => {
        console.error(`Error in retreiving beacon info list from storage`);
      });
  }

  ionViewWillEnter() {
    this.loadMap();
  }

  ionViewDidEnter() {
    console.log('(create-game) ionViewDidEnter Event');
    // Zoom to the beacon location
    this.map.flyTo({ center: [this.beaconDataSer.lng, this.beaconDataSer.lat] });
  }

  ionViewWillLeave() {
    console.log('(create-game), ionViewWillLeave');

    if (navigator.onLine) {
      console.log('online');

      // Only update loc in server when user press save and from stored-beacon-list page
      if (this.selectedCoords != undefined && this.beaconDataSer.major == 0) {
        // update beacon info on server
        this.apiService.updateBeaconInfo(new BeaconInfo(null, this.beaconDataSer.minor, this.selectedCoords[0], this.selectedCoords[1]))
          .then(data => {
            console.log('patch: ', data);
            this.helperService.presentToast('Loc updated in server');
          })
          .catch(e => {
            console.error('(update loc), ', e);
          });
      }
    }
  }

  loadMap(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhlZ2lzZGV2IiwiYSI6ImNqdGQ5dmd2MTEyaWk0YXF0NzZ1amhtOWMifQ.GuFE28BPyzAcHWejNLzuyw';
    //mapboxgl.accessToken = environment.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [7.63, 51.960],
      zoom: 12
    });

    this.map.addControl(new MapboxStyleSwitcherControl());

    /* this.map.on('zoom', () => {
            console.log(`zoom: `, this.map.getZoom());
        }); */

    // Show coords on map click
    this.map.on('click', e => {
      console.log("e:", e.lngLat)
      this.selectedCoords = [e.lngLat.lng, e.lngLat.lat];
      console.log("this.selectedCoords:", this.selectedCoords)
      if (this.marker != undefined) {
        this.marker.remove();
      }
      this.marker = new mapboxgl.Marker({
        draggable: true, color: 'red'
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.map);
      // on marker drag implementation 
      this.marker.on('dragend', () => {
        console.log("onDragEnd: ")
        var lngLat = this.marker.getLngLat();
        this.selectedCoords = [lngLat.lng, lngLat.lat];
        console.log("drag, this.selectedCoords:", this.selectedCoords)
      });
    });
  }

  saveLocation(): void {
    // update selected beacon location
    if (this.selectedCoords != undefined) {
      // update location of seleted beacon
      for (let i = 0; i < this.beaconsStoredList.length; i++) {
        console.log(' search for minor', this.beaconsStoredList[i].minor);
        console.log(' looking for minor', this.beaconDataSer.minor);

        if (this.beaconsStoredList[i].minor == this.beaconDataSer.minor) {
          this.beaconsStoredList[i].lng = this.selectedCoords[0];
          this.beaconsStoredList[i].lat = this.selectedCoords[1];
          console.log('beacon loaction has been updated');

          this.storage.set(this.db_name, this.beaconsStoredList);
          console.log('this.beaconsStoredList: ', this.beaconsStoredList); // added in 14,08.20

          this.changeRef.detectChanges(); // Check for data change to update view Y.Q
        }
      }

      // update MinorNo service to undefined 
      //this.gameServ.changeMinorNo(undefined);

      // navigate to previous page
      this.navCtrl.back();

    } else {
      this.helperService.presentToast('Please select location on the map to save.', 'warning');
    }
  }

  // Test GPS
  getPosition() {
    this.locationServics.getUserPosition().then((data) => {
      console.log('location data: ', data);

      console.log('location coords: ', data['coords']);

      // Zoom to the beacon location
      this.map.flyTo({ zoom: 18, center: [data['coords'].longitude, data['coords'].latitude] });

      if (this.marker2 != undefined) {
        this.marker2.remove();
      }
      this.marker2 = new mapboxgl.Marker()
        .setLngLat([data['coords'].longitude, data['coords'].latitude])
        .addTo(this.map);
    });
  }

  onBackButton() {
    this.navCtrl.back();
  }

}
