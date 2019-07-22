import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { appConfig } from '../app.config';

@Injectable()
export class FAQService {
    constructor(private http: HttpClient) { }

    addfaqData(faqdata) {
        return this.http.post<any>(appConfig.apiUrl + '/faq/addfaqData', faqdata);
    }

    addFaqAnswerByAdmin(answerData) {
        return this.http.post<any>(appConfig.apiUrl + '/faq/addFaqAnswerByAdmin', answerData)
    }


    getAllfaqs() {
        var userId = localStorage.getItem('userId');
        var userType = localStorage.getItem('userType');
        return this.http.get<any>(appConfig.apiUrl + '/faq/getAllfaqs/' + userId + '/' + userType)
    }


}