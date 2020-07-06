import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {
  coords: number[];

  constructor() { }

  // Pass string
  /*   private dataSource = new BehaviorSubject("Hello service!");
    
    serviceData = this.dataSource.asObservable();
  
    changeData(data: any) {
      this.dataSource.next(data);
    } */


  // Pass coordinates
  /*   private coordsSelected = new BehaviorSubject<number[]>([123, 456]);
  
    serviceCoords = this.coordsSelected.asObservable();
  
    changeCoords(coords: number[]) {
      this.coordsSelected.next(coords);
    } */


  // Pass minor to update beacon loaction
  private minorNoSource = new BehaviorSubject(undefined);

  serviceMinorNo = this.minorNoSource.asObservable();

  changeMinorNo(minorNo: number) {
    this.minorNoSource.next(minorNo);
  }
}
