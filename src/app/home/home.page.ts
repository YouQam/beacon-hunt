import { Component, ChangeDetectorRef } from '@angular/core';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon/ngx';
import { Platform } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private isAdvertisingAvailable: boolean = null;

  /* private uuid = '00000000-0000-0000-0000-000000000000'; */

  uuid = 'b9407f30-f5f8-466e-aff9-25556b57fe6d';
  beaconData = [];
  beaconUuid: String;
  length: number = -1;
  beaconFound: boolean = false;


  constructor(private readonly ibeacon: IBeacon, private readonly platform: Platform, private changeRef: ChangeDetectorRef) {
    this.enableDebugLogs();
  }

  public enableDebugLogs(): void {
    this.platform.ready().then(async () => {
      this.ibeacon.enableDebugLogs();
      this.ibeacon.enableDebugNotifications();
    });
  }

  public onStartClicked(): void {
    this.platform.ready().then(() => {


      /* this.startBleFun();
      setTimeout(function () {
        console.log('timeout')
      }, 5000);
      if (!this.beaconFound) {
        this.startBleFun();
      } */
      this.start();

      setInterval(() => {
        //this.startBleFun();
        this.start();
        console.log('inteval,,,,,,,,,,,,,,,,,,,,,,,,,,,');
      }, 10000);
    });
  }

  public start(): void{
    this.startBleFun();
      setTimeout(function () {
        console.log('timeout')
      }, 5000);
      if (!this.beaconFound) {
        this.startBleFun();
      }

  public stopScannning(): void {
    // stop monitoring
    this.ibeacon.stopMonitoringForRegion(this.beaconRegion);
    // stop ranging
    this.ibeacon.stopRangingBeaconsInRegion(this.beaconRegion);
    this.ibeacon.stopRangingBeaconsInRegion(this.beaconRegion)
      .then(async () => {
        console.log(`Stopped ranging beacon region:`, this.beaconRegion);
        this.beaconFound = false;
      })
      .catch((error: any) => {
        console.log(`Failed to stop ranging beacon region: `, this.beaconRegion);
      });
    //

  }

  public startBleFun(): void {

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();

    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    this.ibeacon.setDelegate(delegate);
    this.beaconUuid = this.uuid;

    console.log('--===--- Bluetooth state: ', this.ibeacon.isBluetoothEnabled());

    // Check bluetooth status Y.Q
    this.ibeacon.isBluetoothEnabled()
      .then(
        (data) => console.log('-------=== Enabled', data),
        (error: any) => console.error('-------=== Disabled', error)
      );

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        async (pluginResult: IBeaconPluginResult) => {
          console.log('didRangeBeaconsInRegion: ', pluginResult)
          console.log('//////// pluginResult.beacons size ///////= ' + pluginResult.beacons.length)
          console.log('//////// beaconData size ///////= ' + pluginResult.beacons.length)
          if (pluginResult.beacons.length > 0 && !this.beaconFound) {
            //if (pluginResult.beacons.length >= this.beaconData.length)
              this.beaconData = pluginResult.beacons;
            this.beaconFound = true;
            console.log('+++++++Beacon found+++++++++')
            this.changeRef.detectChanges();
          } else {
            console.log('------Beacon not found-----')
          }

        },
        (error: any) => console.error(`Failure during ranging: `, error)
      );

    delegate.didStartMonitoringForRegion()
      .subscribe(
        (pluginResult: IBeaconPluginResult) =>
          console.log('didStartMonitoringForRegion: ', pluginResult)
        ,
        (error: any) => console.error(`Failure during starting of monitoring: `, error)
      );

    delegate.didEnterRegion()
      .subscribe(
        data => {
          console.log('--//--didEnterRegion: ', data);
        }
      );

    delegate.didExitRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didExitRegion: ', pluginResult);
      }
    );

    console.log(`Creating BeaconRegion with UUID of: `, this.uuid);

    // uuid is required, identifier and range are optional.
    //const beaconRegion = this.ibeacon.BeaconRegion('EST3', this.uuid, 24489, 35011);
    const beaconRegion = this.ibeacon.BeaconRegion('EST3', this.uuid);

    this.ibeacon.startMonitoringForRegion(beaconRegion).
      then(
        () => console.log('Native layer recieved the request to monitoring'),
        (error: any) => console.error('Native layer failed to begin monitoring: ', error)
      );

    this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(() => {
        console.log(`Started ranging beacon region: `, beaconRegion);
      })
      .catch((error: any) => {
        console.error(`Failed to start ranging beacon region: `, beaconRegion);
      });

    /*     this.ibeacon.stopRangingBeaconsInRegion(beaconRegion)
          .then(() => {
            console.log(` ,,,,,,,,,,RANGING Stopppped `, beaconRegion);
          })
          .catch((error: any) => {
            console.error(`,,,,,,RANGING Stopppped: `, beaconRegion);
          }); */


  }

}
