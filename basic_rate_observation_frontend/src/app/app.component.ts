import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';

function hex2a(hexx: string) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'basicObservationFrontend';
  rate: boolean = false
  inspectURL: string = 'http://localhost:5005/inspect/'
  statistic: string = ""

  constructor() {
  }
  observeTab() {
    this.rate = false
  }
  rateTab() {
    this.rate = true
  }
  connectWorldcoin() {
    window.location.href = 'http://localhost:3000'
  }

  async calculate_statistic(data_piece: string) {
    const url: string = this.inspectURL;
    const response = await fetch(url);
    const response_contents = await response.json();
    console.log(hex2a(response_contents['reports'][0]['payload']));
  }

}
