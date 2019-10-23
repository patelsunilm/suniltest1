import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class DiaryService {
    constructor(private http: HttpClient) { }

    addEvent(addEventdetails) {

        return this.http.post<any>(appConfig.apiUrl + '/diary/addEventdetails', addEventdetails)
    }


    getaEventDetails(merchantId) {
        
       
        return this.http.get<any>(appConfig.apiUrl + '/diary/getaEventDetails/' + merchantId)
    
    }

    deleteEvents(eventId) {

        return this.http.delete<any>(appConfig.apiUrl + '/diary/deleteEvents/' + eventId)


    }

    updateEvents(eventdetails) {

        return this.http.post<any>(appConfig.apiUrl + '/diary/updateEvents', eventdetails)
    
      }
}