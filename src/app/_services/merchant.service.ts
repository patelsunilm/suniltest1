import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class MerchantService {
    constructor(private http: HttpClient) { }



    getallMerchentsData() {
        return this.http.get<any>(appConfig.apiUrl + '/merchant/getallMerchentsData')
    }

    getmerchantDatabyId(merchantDataId) {
       
        return this.http.get<any>(appConfig.apiUrl + '/merchant/getmerchantDatabyId/' + merchantDataId)
    }

    updatemerchantData(merchantdata) {
        return this.http.post<any>(appConfig.apiUrl + '/merchant/updatemerchantData', merchantdata)
    }

    merchantStatusToggle(merchantdata, id) {
        return this.http.post<any>(appConfig.apiUrl + '/merchant/merchantStatusToggle/', { 'status': merchantdata, 'id': id })
    }

    deletemerchantData(merchantDataId, name) {
        var userId = localStorage.getItem('userId');
        return this.http.delete<any>(appConfig.apiUrl + '/merchant/deletemerchantData/' + merchantDataId + '/' + userId + '/' + name)
    }

    getMerchentsbyId(catid) {

        return this.http.get<any>(appConfig.apiUrl + '/merchant/getMerchentsbyId/' + catid)


    }
}