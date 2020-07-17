import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { IBeacon, IBeaconPluginResult, Beacon } from '@ionic-native/ibeacon/ngx';
import { Platform, NavController } from '@ionic/angular';
import mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconData'
import { GameServiceService } from '../services/game-service.service';
import { Task } from '../models/task';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { Game } from '../models/game';



@Component({
  selector: 'app-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss'],
})
export class PlayPage implements OnInit {

  @ViewChild("map") mapContainer;
  //@ViewChild("marker") directionMarker;
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;

  uuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
  beaconData = [];
  beaconUuid: String;
  scanStatus: boolean = false;
  private delegate: any = null;
  public beaconRegion: any = null;

  public beaconinfoList: BeaconInfo[];
  public beaconsStoredList: BeaconInfo;

  public tasksList: Task[];
  public currentTask: Task;
  taskIndex: number;
  selectedGame: Game;


  constructor(private gameServ: GameServiceService, public storage: Storage, public navCtrl: NavController, private readonly ibeacon: IBeacon, private readonly platform: Platform, private changeRef: ChangeDetectorRef) {
    this.platform.ready().then(() => {
      this.requestLocPermissoin();
      this.enableDebugLogs();
    });
  }

  ngOnInit() {
    // Retrteive selected game
    this.gameServ.serviceSelectedGame
      .subscribe(selGame => (this.selectedGame = selGame));
    if (this.selectedGame != undefined) {
      this.tasksList = this.selectedGame.tasks;
      this.currentTask = this.tasksList[0];
      this.taskIndex = 0;
      console.log('◊◊◊ (play) sent bgame :', this.selectedGame);
      console.log('(play), retreived game tasks: ', this.tasksList);
    } else {
      console.log('◊◊◊ (play) game is undefined');
    }


  }

  ionViewWillEnter() {
    console.log('home Resume Event, map', this.map);
    this.updateBeaconStoredList();


    if (this.map == undefined) {
      console.log('◊ initialize map');
      mapboxgl.accessToken = 'pk.eyJ1IjoidGhlZ2lzZGV2IiwiYSI6ImNqdGQ5dmd2MTEyaWk0YXF0NzZ1amhtOWMifQ.GuFE28BPyzAcHWejNLzuyw';
      //mapboxgl.accessToken = environment.mapboxAccessToken;
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [7.63, 51.960],
        zoom: 12
      });

      this.map.addControl(new MapboxStyleSwitcherControl());

    } else {
      console.log('ÒÒÒ map is alreasdy there')
    }
  }

  ionViewDidEnter() {
    this.initializeTask();
    console.log('home ionViewDidEnter Event');
  }

  initializeTask() {
    // Add marker
    this.marker = new mapboxgl.Marker()
      .setLngLat([this.currentTask.coords[0], this.currentTask.coords[1]])
      .addTo(this.map);

    // Zoom to the beacon location
    this.map.flyTo({ center: [this.currentTask.coords[0], this.currentTask.coords[1]] });
  }

  requestLocPermissoin(): void {
    // Request permission to use location on iOS
    if (this.platform.is('ios')) {
      this.ibeacon.requestAlwaysAuthorization();
      console.log(`: request ios permisson`);
    }
  }

  enableDebugLogs(): void {
    this.ibeacon.enableDebugLogs();
    this.ibeacon.enableDebugNotifications();
  }

  public onScanClicked(): void {

    /* if (this.marker != undefined) {
      this.marker.remove();
      console.log('/ marker has been removed successfully');
    } */

    if (!this.scanStatus) {
      this.startScanning();
      this.scanStatus = true;
    } else {
      this.scanStatus = false;
      this.stopScannning();
    }
  }

  public stopScannning(): void {
    this.scanStatus = false; // Change scan state Y.Q
    // stop ranging
    this.ibeacon.stopRangingBeaconsInRegion(this.beaconRegion)
      .then(async () => {
        console.log(`Stopped ranging beacon region:`, this.beaconRegion);
      })
      .catch((error: any) => {
        console.log(`Failed to stop ranging beacon region: `, this.beaconRegion);
      });
  }

  startScanning() {
    // create a new delegate and register it with the native layer
    this.delegate = this.ibeacon.Delegate();

    this.ibeacon.setDelegate(this.delegate);

    this.beaconUuid = this.uuid;

    // Check bluetooth status Y.Q
    /*     this.ibeacon.isBluetoothEnabled()
          .then(
            (data) => console.log('-------=== Enabled', data),
            (error: any) => console.error('-------=== Disabled', error)
          ); */

    // Subscribe to some of the delegate's event handlers
    this.delegate.didRangeBeaconsInRegion()
      .subscribe(
        async (pluginResult: IBeaconPluginResult) => {
          console.log('didRangeBeaconsInRegion: ', pluginResult)
          console.log('found beacons size: ' + pluginResult.beacons.length)
          if (pluginResult.beacons.length > 0) {
            this.beaconData = pluginResult.beacons;
            this.onBeaconFound(this.beaconData);  // check received beacons to trigger an event
            this.changeRef.detectChanges(); // Check for data change to update view Y.Q
          } else {
            console.log('no beacons nearby')
          }
        },
        (error: any) => console.error(`Failure during ranging: `, error)
      );

    this.delegate.didStartMonitoringForRegion()
      .subscribe(
        (pluginResult: IBeaconPluginResult) =>
          console.log('didStartMonitoringForRegion: ', pluginResult)
        ,
        (error: any) => console.error(`Failure during starting of monitoring: `, error)
      );

    console.log(`Creating BeaconRegion with UUID of: `, this.uuid);

    // uuid is required, identifier and range are optional.
    this.beaconRegion = this.ibeacon.BeaconRegion('EST3', this.uuid);

    this.ibeacon.startMonitoringForRegion(this.beaconRegion).
      then(
        () => console.log('Native layer recieved the request to monitoring'),
        (error: any) => console.error('Native layer failed to begin monitoring: ', error)
      );

    this.ibeacon.startRangingBeaconsInRegion(this.beaconRegion)
      .then(() => {
        console.log(`Started ranging beacon region: `, this.beaconRegion);
      })
      .catch((error: any) => {
        console.error(`Failed to start ranging beacon region: `, this.beaconRegion);
      });
  }

  onBeaconFound(receivedData: Beacon[]): void {
    //to compare with one beacon at a time
    for (let i = 0; i < receivedData.length; i++) {
      console.log('◊ look for Beacon: 56411');
      console.log(' receivedData[i].minor == this.currentTask.minor):', receivedData[i].minor, ' == ', this.currentTask.minor);
      if (this.beaconsStoredList) {
        if (receivedData[i].minor == this.currentTask.minor) {
          console.log(' Found Beacon: ', this.currentTask.minor);


          // Add marler
          new mapboxgl.Marker()
            .setLngLat([this.beaconsStoredList[0].lng, this.beaconsStoredList[0].lat])
            .addTo(this.map);

          // Zoom to the beacon location
          this.map.flyTo({ center: [this.currentTask.coords[0], this.currentTask.coords[1]] });
          console.log(' Fly to: ', [this.currentTask.coords[0], this.currentTask.coords[1]]);


          // Stop ranging
          this.stopScannning();
        }
      }
    }

    //to compare with mulitple beacons at a time
    /* for (let i = 0; i < receivedData.length; i++) {
      for (let j = 0; j < this.beaconinfoList.length; j++) {
        console.log(' search for beacon major:', receivedData[i].major);
        if (this.beaconinfoList) {
          if (receivedData[i].major == this.beaconinfoList[j].major) {
            console.log(' Found Beacon: ', this.beaconsStoredList.major);

            // Add marker
            new mapboxgl.Marker()
              .setLngLat([this.beaconinfoList[j].lng, this.beaconinfoList[j].lat])
              .addTo(this.map);

            // Zoom to the beacon location
            this.map.flyTo({ center: [this.beaconinfoList[j].lng, this.beaconinfoList[j].lat] });

            //this.changeRef.detectChanges(); // Check for data change to update view Y.Q


            // Stop ranging
            this.stopScannning();
          }
        }
      }
    } */
  }

  navigateAddBeaconPage() {
    // get a key/value pair from db
    this.storage.get('beacon_info_list').then((val) => {
      //console.log('From home, beacon info display: ', val);
    });
    this.navCtrl.navigateForward('add-beacon');

  }

  saveData(event) {
    // set a key/value
    //this.storage.set('name', 'yousef');
    //console.log(`: Data stored`);

    /* let beaconinfo1: BeaconInfo = new BeaconInfo(56411, 14338, 7.814, 51.675); // hamm
    let beaconinfo2: BeaconInfo = new BeaconInfo(24489, 35011, 8.538, 52.010); // beliefeld

    this.beaconinfoList = [beaconinfo1, beaconinfo2]
    this.storage.set('beacon_info_list', this.beaconinfoList); // sotre in db */
    //this.beaconinfo = new BeaconInfo(56411, 14338);
    ////this.beaconinfo = new BeaconInfo(24489, 35011);
    //this.storage.set('beacon_info', this.beaconinfo); // sotre in db
    //console.log(' Beacon info stored:', this.beaconinfoList);
    //console.log(' id=:', event.target.attributes.ids);

    // update service
    //this.gameServ.changeCoords([111, 222]);

    //this.updateBeaconStoredList();
  }

  updateBeaconStoredList() {
    // get a key/value pair from db
    this.storage.get('beacon_info_list').then((val) => {
      this.beaconsStoredList = val;
      console.log(' From home, retreived list from db: ', this.beaconsStoredList);

    });
  }

  showMap(): void {
    /* if (this.map == undefined) {

      mapboxgl.accessToken = environment.mapboxAccessToken;
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [7.63, 51.960],
        zoom: 12
      });
    } else {
      console.log('ÒÒÒ map is alreasdy there')
    } */
  }

  onNextClicked(): void {
    console.log('Next task clicked');

    if (this.marker != undefined) {
      this.marker.remove();
      console.log('/ marker has been removed successfully');
    }

    if (this.taskIndex + 1 <= this.tasksList.length) {
      this.taskIndex += 1;
      this.currentTask = this.tasksList[this.taskIndex];

      console.log('◊ı◊ Task num:', this.taskIndex);


      this.initializeTask();
    } else {
      console.log('You have passed all tasks successfully');
    }
  }

  onBackButton() {
    this.navCtrl.back();
  }
}