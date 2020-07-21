import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Observable, Subscriber } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LocationService {

  public geolocationSubscription: Observable<Geolocation>;
  private watchID: string;

  options: GeolocationOptions;
  currentPos: Geoposition;

  constructor(private geolocation: Geolocation,) { }

  getUserPosition() {
    return new Promise((resolve, reject) => {
      this.options = {
        maximumAge: 3000,
        enableHighAccuracy: true
      };

      this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
        this.currentPos = pos;
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: new Date(),
        };
        console.log('from loc service, loc', location);
        resolve(pos);
      }, (err: PositionError) => {
        console.log("error : " + err.message);
        reject(err.message);
      });
    });
  }

  init() {
    console.log("init")
    this.geolocationSubscription = Observable.create((observer: Subscriber<Geoposition>) => {
      let watch = this.geolocation.watchPosition({enableHighAccuracy: true}).subscribe((data) => {
        console.log('from init, loc', data);
        observer.next(data);
      })
    })
  }

  clear() {
    //this.geolocation
  }




}