import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient) { }

  getAllorders() {
    var merchantId = localStorage.getItem('userId');
    var userType = localStorage.getItem('userType');
    return this.http.get<any>(appConfig.apiUrl + '/order/getAllorders/' + merchantId + '/' + userType)
  }

  getAllproductorderdetails(appuserId) {
    return this.http.get<any>(appConfig.apiUrl + '/order/getAllproductorderdetails/' + appuserId)
  }
}