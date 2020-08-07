import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { BeaconInfo } from '../models/beaconInfo';
import { Game } from '../models/game';
import { GameResults } from '../models/gameResults';


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

  updateBeaconInfo(beaconInfo: BeaconInfo): Promise<any> {
    return this.http
    .patch('http://192.168.0.242:3000/beacon-info/'+beaconInfo.minor, beaconInfo, { observe: "response" })
    .toPromise();
  }

  getGame(): Promise<any> {
    return this.http
    .get('http://192.168.0.242:3000/game')
    .toPromise();
  }

  postGame(game: Game): Promise<any> {
    return this.http
    .post('http://192.168.0.242:3000/game', game, { observe: "response" })
    .toPromise();
  }

  postGameResults(gameResults: GameResults): Promise<any> {
    return this.http
    .post('http://192.168.0.242:3000/game-results', gameResults, { observe: "response" })
    .toPromise();
  }
}
