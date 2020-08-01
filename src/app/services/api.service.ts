import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { BeaconInfo } from '../models/beaconInfo';
import { Game } from '../models/game';


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }


  getBeaconInfo(): Promise<any> {
    return this.http
    .get('http://192.168.0.242:3000/beacon-info')
    .toPromise();
  }

  postBeaconInfo(beaconInfo: BeaconInfo): Promise<any> {
    return this.http
    .post('http://192.168.0.242:3000/beacon-info', beaconInfo, { observe: "response" })
    .toPromise();
  }

  getGame(game: Game): Promise<any> {
    return this.http
    .get('http://192.168.0.242:3000/game')
    .toPromise();
  }

  postGame(game: Game): Promise<any> {
    return this.http
    .post('http://192.168.0.242:3000/game', game, { observe: "response" })
    .toPromise();
  }

}
