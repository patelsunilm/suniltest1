import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class DashbordService {

  constructor(private http: HttpClient) { }
  


  getAllcountfaqs() {
     var userId = localStorage.getItem('userId');
    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllcountfaqs/')
 
  }


  getAllmerchantcounts() {

   
    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllmerchantcounts' )
 
  }
 
 
  getAllusercount() {
    
    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllusercount' )

  }


  getAllcountfeedback() {

    return this.http.get<any>(appConfig.apiUrl + '/dashboard/getAllcountfeedback' )

  }
}
