import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class NotificationService {
    constructor(private http: HttpClient) { }



    addnotification(notification) {
     
        return this.http.post<any>(appConfig.apiUrl + '/notifications/addnotification',notification)
    }

  
}