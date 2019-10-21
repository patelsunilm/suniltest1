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
    return this.http.get<any>(appConfig.apiUrl + '/order/getAllorders/' + merchantId + '/' + userType);
  }

  getAllproductorderdetails(appuserId) {
    return this.http.get<any>(appConfig.apiUrl + '/order/getAllproductorderdetails/' + appuserId);
  }



  getProductsbydate(productdetails) {

   
    return this.http.post<any>(appConfig.apiUrl + '/order/getProductsbydate' , productdetails);

  }

  getProductsbyid(productid) {
    
    return this.http.post<any>(appConfig.apiUrl + '/order/getProductsbyid/' ,{"productid" : productid });

  }

  getnumberofcustomerpurchases(purchesdetails) {
    
    return this.http.post<any>(appConfig.apiUrl + '/order/getnumberofcustomerpurchases' , purchesdetails);

  }

  getproductratingcounts(prodetails) {
   
    return this.http.post<any>(appConfig.apiUrl + '/order/getproductratingcounts' , prodetails);

  }

  getvalueofcustomerpurchases(customervalue) {

    return this.http.post<any>(appConfig.apiUrl + '/order/getvalueofcustomerpurchases' , customervalue);

  }
}