import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { BeaconInfo } from '../models/beaconInfo';
import { Game } from '../models/game';
import { GameResults } from '../models/gameResults';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }


  getBeaconInfo(): Promise<any> {
    return this.http
    .get(`${environment.apiURL}/beacon-info` )
    .toPromise();
  }

  postBeaconInfo(beaconInfo: BeaconInfo): Promise<any> {
    return this.http
    .post(`${environment.apiURL}/beacon-info`, beaconInfo, { observe: "response" })
    .toPromise();
  }

  updateBeaconInfo(beaconInfo: BeaconInfo): Promise<any> {
    return this.http
    .patch(`${environment.apiURL}/beacon-info/`+beaconInfo.minor, beaconInfo, { observe: "response" })
    .toPromise();
  }

  getGame(): Promise<any> {
    return this.http
    .get(`${environment.apiURL}/game`)
    .toPromise();
  }

  postGame(game: Game): Promise<any> {
    return this.http
    .post(`${environment.apiURL}/game`, game, { observe: "response" })
    .toPromise();
  }

  postGameResults(gameResults: GameResults): Promise<any> {
    return this.http
    .post(`${environment.apiURL}/game-results`, gameResults, { observe: "response" })
    .toPromise();
  }

  getGameResults(): Promise<any> {
    return this.http
    .get(`${environment.apiURL}/game-results`)
    .toPromise();
  }
}
