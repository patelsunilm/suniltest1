import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class DashbordService {

  constructor(private http: HttpClient) { }
  

  getAllcountsproducts() {

    var userId = localStorage.getItem('userId');
    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllcountsproducts/' + userId)
  }

  getAllcountfaqs() {
    var userId = localStorage.getItem('userId');
    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllcountfaqs/' + userId)
  }

}
