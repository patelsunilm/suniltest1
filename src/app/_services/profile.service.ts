import { Injectable,Input,Output,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as $ from 'jquery';
import { appConfig } from '../app.config';
import { Subject } from 'rxjs/Subject';



@Injectable()
export class ProfileService {
    constructor(private http: HttpClient) { }
    private _listners = new Subject<any>();
    public stringSubject = new Subject<string>();

    // listen(): Observable<any> {
    //     return this._listners.asObservable();
    // }

    // filter(filterBy: string) {
    //     console.log('filtetsb');
    //     console.log(filterBy);
    //     this._listners.next(filterBy);
    // }
    @Input('childToMaster') masterName: string;

    @Output() childToParent = new EventEmitter<any>();
  
    uploadLogoImage(Files): Observable<any> {

        const formData: any = new FormData();
        const files: Array<File> = Files;
        for (let i = 0; i < Files.length; i++) {

           
            if(Files[i] == '') {

            } else {
                formData.append("uploads[]", files[i], files[i]['name']);
            }
            

        }

        return this.http.post<any>(appConfig.apiUrl + '/uploadproductfiles', formData);
    }


    getprofileInfo(userId) {

        return this.http.get<any>(appConfig.apiUrl + '/profile/getprofileInfo/' + userId)
    }

    
    updateprofile(profiledata) {

        return this.http.post<any>(appConfig.apiUrl + '/profile/updateprofile', profiledata)
            .map(user => {

                if (user.string == 'Business name already exists.' || user.string == 'Email already exist.') {
                    return user;
                } else {
                   
                    
                    this.stringSubject.next(user);
                    // this.stringSubject.next(user.image);


                    localStorage.setItem('name', user.name);
                    localStorage.setItem('myprofilelogoimage', user.image);
                    // $('#CurrencyChnage').fadeIn('slow').load('toolbar.component.ts').fadeOut('slow',function(){
                
                   
                    // }); 
        
                        return user;
                 
                }
            });
    }

    getAllcountries() {

        return this.http.get<any>(appConfig.apiUrl + '/profile/getAllcountries')

    }


    getallstates(countrieid) {

           
        return this.http.post<any>(appConfig.apiUrl + '/profile/getallstates', { 'countrieId': countrieid })

    }


    getallcity(stateid) {

      
        return this.http.post<any>(appConfig.apiUrl + '/profile/getallcity', { 'stateId': stateid })

    }
}