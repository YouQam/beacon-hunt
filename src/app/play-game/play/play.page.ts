import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { IBeacon, IBeaconPluginResult, Beacon } from '@ionic-native/ibeacon/ngx';
import { Platform, NavController } from '@ionic/angular';
import mapboxgl from "mapbox-gl";
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { BeaconInfo } from 'src/app/models/beaconInfo'
import { GameServiceService } from '../../services/game-service.service';
import { Task } from '../../models/task';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { Game } from '../../models/game';
import { LocationService } from '../../services/location.service';
import { Subscription } from 'rxjs';
import { Geoposition, Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { HelperService } from '../../services/helper-functions.service';

import { AnimationOptions } from 'ngx-lottie';
import { GameResults } from 'src/app/models/gameResults';
import { TasksDetail } from 'src/app/models/tasksDetail';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss'],
})
export class PlayPage implements OnInit {

  @ViewChild("map") mapContainer;
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

  positionSubscription: Subscription;
  public lastKnownPosition: Geolocation;

  gpsToBeaconDistance: number = 0;

  reachedUsingGPS: boolean = false;
  reachedUsingBeacon: boolean = false;

  private beaconAudio: HTMLAudioElement = new Audio();
  private gpsAudio: HTMLAudioElement = new Audio();
  public lottieConfig: AnimationOptions;
  public showGameFinish: boolean = false;
  public gpsAccuracy: number = 0;
  public gameResults: any;
  public tasksDetail: TasksDetail[];
  public iosDevice: boolean = false;

  constructor(private helperFuns: HelperService, public locationServics: LocationService, private gameServ: GameServiceService, public storage: Storage, public navCtrl: NavController, private readonly ibeacon: IBeacon, private readonly platform: Platform, private changeRef: ChangeDetectorRef, private helperService: HelperService, private apiService: ApiService) {
    this.platform.ready().then(() => {
      //this.requestLocPermissoin();
      this.enableDebugLogs();

      this.gpsAudio.src = 'assets/sounds/little_robot_sound_factory_Jingle_Win_Synth_04.mp3'
      this.beaconAudio.src = 'assets/sounds/cartoon_success_fanfair.mp3'
    });

    this.lottieConfig = {
      path: "assets/lottie/success.json",
      renderer: "canvas",
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {
    // Check if device platform is iOS
    if (! this.platform.is('ios')) {
      this.iosDevice = true;
    }

    // Retrteive selected game
    this.gameServ.serviceSelectedGame
      .subscribe(selGame => (this.selectedGame = selGame));
    if (this.selectedGame != undefined) {
      this.tasksList = this.selectedGame.tasks;
      this.currentTask = this.tasksList[0];
      this.taskIndex = 0;
      console.log('◊◊◊ (play) sent bgame :', this.selectedGame);

      // initialize game results
      this.tasksDetail = [];
      this.tasksDetail = [new TasksDetail(this.currentTask._id, this.currentTask.distanceMeter, null, null, null, null, null)];
      this.gameResults = new GameResults(this.selectedGame.name, new Date().toLocaleString(undefined, {hour12: false}), null, null);
      console.log('gameResults: ', this.gameResults);

      // Start scanning
      this.onScanClicked();

    } else {
      console.log('◊◊◊ (play) game is undefined');
    }

  }

  ionViewWillEnter() {
    console.log('home Resume Event, map', this.map);
    this.updateBeaconStoredList();

    // Geolocation initializng 
    this.locationServics.init();
    this.positionSubscription = this.locationServics.geolocationSubscription.subscribe(position => {

      // Draw animatied icon on user position
      if (this.map && this.map.getLayer('geolocate')) {
        this.map.getSource('geolocate').setData({
          type: "geolocate",
          coordinates: [position['coords'].longitude, position['coords'].latitude]
        });
      }

      this.lastKnownPosition = position;
      this.gpsAccuracy = this.lastKnownPosition['coords'].accuracy;
      console.log('(play-page), this.LastKnownPosition lng,lat: ', this.lastKnownPosition['coords'].latitude, ', ', this.lastKnownPosition['coords'].longitude);

      // Zoom to the beacon location
      this.map.flyTo({ center: [this.lastKnownPosition['coords'].longitude, this.lastKnownPosition['coords'].latitude] });

      // Check if user reached destination using GPS
      if (this.selectedGame.useGPS && !this.reachedUsingGPS && this.userReachedUsingGPS(this.currentTask.coords)) {
        console.log('(), GPS reached destination');
        this.gpsAudio.play();
        this.reachedUsingGPS = true;
        if (this.reachedUsingGPS && this.reachedUsingBeacon) {
          this.onNextTask();
        }
      }
    })

    // Map initializing
    if (this.map == undefined) {
      console.log('◊ initialize map');
      mapboxgl.accessToken = environment.mapboxAccessToken;
      //mapboxgl.accessToken = environment.mapboxAccessToken;
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [7.63, 51.960],
        zoom: 12
      });
      this.map.addControl(new MapboxStyleSwitcherControl(), 'bottom-left');

    }

    this.animatedUserLocIcon();

  }

  ionViewDidEnter() {
    this.initializeTask();
    console.log('home ionViewDidEnter Event');
  }

  ionViewWillLeave() {
    this.stopScanningTracking();
  }

  stopScanningTracking() {
    // Stop scanning for beacons
    if (this.beaconRegion) {
      this.stopScannning();
      console.log(`Region stopped`);

    }

    // Stop tracking user location
    if (this.positionSubscription != undefined) {
      this.positionSubscription.unsubscribe();
      this.locationServics.clear();
      console.log(`Geolocatoin unsubscribed`);
    }
  }

  userReachedUsingGPS(currentTaskLoc) {
    console.log('userReachedBeacon');

    this.gpsToBeaconDistance = this.helperFuns.getDistanceFromLatLonInM(
      currentTaskLoc[1],
      currentTaskLoc[0],
      this.lastKnownPosition['coords'].latitude,
      this.lastKnownPosition['coords'].longitude
    );

    console.log('userReachedBeacon, this.gpsToBeaconDistance <= this.currentTask.distanceMeter: ', this.gpsToBeaconDistance.toFixed(2), '<=', this.currentTask.distanceMeter);
    if (this.gpsToBeaconDistance <= this.currentTask.distanceMeter) {
      // Initialize task detail (using GPS)
      this.tasksDetail[this.taskIndex].reachedGPSTime = new Date().toLocaleString(undefined, {hour12: false});
      this.tasksDetail[this.taskIndex].reachedGPSDistance = this.gpsToBeaconDistance;
      this.tasksDetail[this.taskIndex].GPSAccuracy = this.gpsAccuracy;

      return true;
    }

    return false;

  }

  initializeTask() {
    // Add marker
    if (this.marker != undefined) {
      this.marker.remove();
    }
    this.marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([this.currentTask.coords[0], this.currentTask.coords[1]])
      .addTo(this.map);

    // Zoom to the beacon location
    this.map.flyTo({ center: [this.currentTask.coords[0], this.currentTask.coords[1]] });
  }

  enableDebugLogs(): void {
    this.ibeacon.enableDebugLogs();
    this.ibeacon.enableDebugNotifications();
  }

  public onScanClicked(): void {
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
    //for testing on browser
    ///////////////////////////////////////////////////
    /* this.beaconAudio.play();
    this.reachedUsingBeacon = true;

    if (this.reachedUsingBeacon && (this.selectedGame.useGPS && this.reachedUsingGPS)) {
      // Initialize task detail (using beacon)
      //this.tasksDetail[this.taskIndex].reachedBeaconTime = new Date().toISOString();
      //this.tasksDetail[this.taskIndex].reachedBeaconDistance = receivedData[i].accuracy;
      this.onNextTask();
    } */
    ////////////////////////////////////////////////////


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
    //Ingnore it if beacon is allready found and waiting for GPS
    if (!this.reachedUsingBeacon) {
      //to compare with one beacon at a time
      for (let i = 0; i < receivedData.length; i++) {
        console.log('◊ look for Beacon: 56411');
        console.log(' receivedData[i].minor == this.currentTask.minor):', receivedData[i].minor, ' == ', this.currentTask.minor);
        console.log(' receivedData[i].tx == this.currentTask.distanceMeter:', receivedData[i].accuracy, '<=', this.currentTask.distanceMeter);

        if (this.beaconsStoredList) {
          if (receivedData[i].minor == this.currentTask.minor && receivedData[i].accuracy <= this.currentTask.distanceMeter) { // Check minor and distance
            console.log(' Found Beacon: ', this.currentTask.minor);

            console.log('(), User reached the beacon');
            this.beaconAudio.play();
            this.reachedUsingBeacon = true;

            if (this.reachedUsingBeacon && (this.selectedGame.useGPS && this.reachedUsingGPS)) {
              // Initialize task detail (using beacon)
              this.tasksDetail[this.taskIndex].reachedBeaconTime = new Date().toLocaleString(undefined, {hour12: false});
              this.tasksDetail[this.taskIndex].reachedBeaconDistance = receivedData[i].accuracy;

              this.onNextTask();
            }

            // Stop scanning for beacons
            //this.stopScannning();
          }
        }
      }
    }
  }

  updateBeaconStoredList() {
    // get a key/value pair from db
    this.storage.get('beacon_info_list').then((val) => {
      this.beaconsStoredList = val;
      console.log(' From home, retreived list from db: ', this.beaconsStoredList);

    });
  }

  onNextTask(): void {
    console.log('Next task clicked');

    if (this.marker != undefined) {
      this.marker.remove();
      console.log('/ marker has been removed successfully');
    }

    if (this.taskIndex + 1 < this.tasksList.length) {
      this.taskIndex += 1;
      this.currentTask = this.tasksList[this.taskIndex];

      // initialize game results
      this.tasksDetail[this.taskIndex] = new TasksDetail(this.currentTask._id, this.currentTask.distanceMeter, null, null, null, null, null);
      console.log('tasksDetail, on next: ', this.tasksDetail);

      console.log('◊ı◊ Task num:', this.taskIndex);

      this.reachedUsingBeacon = false;
      this.reachedUsingGPS = false;


      this.initializeTask();
    } else {
      // Initialize game results end time and tasksDetail
      this.gameResults.endTime = new Date().toLocaleString(undefined, {hour12: false});
      this.gameResults.tasksDetail = this.tasksDetail;
      this.uploadGameResults();

      console.log('You have passed all tasks successfully');
      /*this.helperService.presentToast("You have passed all tasks successfully"); */
      this.stopScanningTracking();
      this.showGameFinish = true;
    }
  }

  uploadGameResults() {
    // Check if there is a network connection to upload game results of each task
    if (navigator.onLine) {

      this.apiService.postGameResults(this.gameResults) // sotre in server in the cloaud */
        .then(data => {
          console.log(data);

          if (data.status == 200) {
            this.helperService.presentToast('GameResults uploaded successfully!');
          }
        })
        .catch(e => {
          console.error('(postGameResult), ', e['error'].message);
          this.helperService.presentToast('Due to network connection, game results couldn\'t uploaded', "warning");
        });
    } else {
      console.log('Network status', 'offline');
    }

  }

  navigateHomeMenu() {
    //this.showGameFinish = false;
    // navigate to menu
    this.navCtrl.navigateForward('menu');
  }

  onBackButton() {
    this.navCtrl.back();
  }

  animatedUserLocIcon() {
    var size = 150;
    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      context: null,

      // get rendering context for the map canvas when layer is added to the map
      onAdd: () => {
        var canvas = document.createElement('canvas');
        canvas.width = pulsingDot.width;
        canvas.height = pulsingDot.height;
        pulsingDot.context = canvas.getContext('2d');
      },

      // called once before every frame where the icon will be used
      render: () => {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = pulsingDot.context;

        // draw outer circle
        context.clearRect(0, 0, pulsingDot.width, pulsingDot.height);
        context.beginPath();
        context.arc(
          pulsingDot.width / 2,
          pulsingDot.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(
          pulsingDot.width / 2,
          pulsingDot.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        pulsingDot.data = context.getImageData(
          0,
          0,
          pulsingDot.width,
          pulsingDot.height
        ).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        this.map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };

    this.map.on('load', () => {
      this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      this.map.addSource('geolocate', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [this.lastKnownPosition['coords'].longitude, this.lastKnownPosition['coords'].latitude]
              }
            }
          ]
        }
      });

      this.map.addLayer({
        'id': 'geolocate',
        'type': 'symbol',
        'source': 'geolocate',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    });
  }

}