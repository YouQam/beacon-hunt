import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { BeaconInfo } from '../models/beaconInfo';


@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient) { }


  getInfo(): Promise<any> {
    return this.http
    .get('http://192.168.0.242:3000/users/')
    .toPromise();
  }

  postInfo(beaconInfo: BeaconInfo): Promise<any> {
    return this.http
    .post('http://192.168.0.242:3000/beacon-info', beaconInfo, { observe: "response" })
    .toPromise();
  }

  


}
