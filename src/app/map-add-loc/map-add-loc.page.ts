import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { GameServiceService } from '../services/game-service.service';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, Platform } from '@ionic/angular';
import { BeaconInfo } from 'src/app/models/beaconData'
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationService } from '../services/location.service';
import { Subscription } from 'rxjs';

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


  constructor(public locationServics: LocationService, private geolocation: Geolocation, private changeRef: ChangeDetectorRef, private readonly platform: Platform, public navCtrl: NavController, public storage: Storage, public toastController: ToastController, private gameServ: GameServiceService) {
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
      });
  }

  ionViewWillEnter() {
    this.loadMap();
  }

  ionViewDidEnter() {
    console.log('(create-task) ionViewDidEnter Event');
    // Zoom to the beacon location
    this.map.flyTo({ center: [this.beaconDataSer.lng, this.beaconDataSer.lat] });
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
        draggable: true
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

  getPosition() {

    /* console.log('◊ı◊ getPosition');

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('◊ı◊ resp.coords.latitude: ', resp.coords.latitude);
      console.log('◊ı◊ resp.coords.latitude: ', resp.coords.longitude);
      this.coords =[resp.coords.longitude, resp.coords.latitude];
      this.marker2 = new mapboxgl.Marker()
        .setLngLat([this.coords[0], this.coords[1]])
        .addTo(this.map);
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    }); */

    this.locationServics.getUserPosition().then((data) => {
      console.log('location data: ', data);

      console.log('location coords: ', data['coords']);

      console.log('location lat: ', data['coords'].latitude);
      console.log('location lat: ', data['coords'].longitude);


      this.marker2 = new mapboxgl.Marker()
        .setLngLat([data['coords'].longitude, data['coords'].latitude])
        .addTo(this.map);


    });


  }


  watchPosition() {

    console.log('◊ı◊ watchPosition');

    this.locationServics.init();

    this.positionSubscription = this.locationServics.geolocationSubscription.subscribe(position => {
      console.log('◊ı◊ watchPosition, watchPosition:', position);

      console.log('location lat: ', position['coords'].latitude);
      console.log('location lat: ', position['coords'].longitude);


      this.marker2 = new mapboxgl.Marker()
        .setLngLat([position['coords'].longitude, position['coords'].latitude])
        .addTo(this.map);

    })


    /* let watch = this.geolocation.watchPosition({});
    watch.subscribe((data) => {

      this.coords = [data.coords.longitude, data.coords.latitude];

      this.marker2 = new mapboxgl.Marker()
        .setLngLat([data.coords.longitude, data.coords.latitude])
        .addTo(this.map);

      // Zoom to the beacon location
      this.map.flyTo({ center: [data.coords.longitude, data.coords.latitude] });

      console.log('◊2◊ watchPosition');

      console.log('◊ı◊ resp.coords.latitude: ', data.coords.latitude);
      console.log('◊ı◊ resp.coords.latitude: ', data.coords.longitude);

      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });*/
  } 


}
