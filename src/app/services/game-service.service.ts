import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { BeaconInfo } from '../models/beaconInfo';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {
  coords: number[];

  constructor() { }

  // Pass string
  /*   private dataSource = new BehaviorSubject("Hello service!");   */


  // Pass coordinates
  /*   private coordsSelected = new BehaviorSubject<number[]>([123, 456]);  */


  // Pass minor to update beacon loaction
  private minorNoSource = new BehaviorSubject(undefined);

  serviceMinorNo = this.minorNoSource.asObservable();

  changeMinorNo(minorNo: number) {
    this.minorNoSource.next(minorNo);
  }

  // Pass beaconData to update beacon loaction
  private beaconData = new BehaviorSubject(undefined);

  serviceBeaconData = this.beaconData.asObservable();

  changebeaconData(beaconData: BeaconInfo) {
    this.beaconData.next(beaconData);
  }

  // Pass selected game
  private selectedGame = new BehaviorSubject(undefined);

  serviceSelectedGame = this.selectedGame.asObservable();

  ChangeGame(game: Game) {
    this.selectedGame.next(game);
  }
}
