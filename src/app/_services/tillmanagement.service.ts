import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as $ from 'jquery';
import { appConfig } from '../app.config';

@Injectable()
export class tillManagementService {
    constructor(private http: HttpClient) { }
 


    getalltillType() {

        return this.http.get<any>(appConfig.apiUrl + '/tillmanagement/getalltillType')
    }

    addtilldetails(tillsdetails) {

        
        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/addtilldetails', tillsdetails)

    }

    getAllsecondarytilltype(merchantId) {


        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/getAllsecondarytilltype', { 'merchantId': merchantId } )

    }

    getTillManagementDetails(merchantId) {

        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/getTillManagementDetails', { 'merchantId': merchantId } )

    }


    deletetilltypename(tillsdetails , id) {

        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/deletetilltypename', { 'tillsdetails': tillsdetails  ,'id' : id} )

    }

    getTillnametbyId(id , merchantId) {

        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/getTillnametbyId', { 'tilltypeid': id , 'merchantId' : merchantId})

    }

    updatetilltypename(tillname) {

        return this.http.post<any>(appConfig.apiUrl + '/tillmanagement/updatetilltypename', tillname)
 
    }
}