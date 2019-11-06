import { Injectable } from '@angular/core';
import { Router, CanActivate,CanActivateChild,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
// import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

@Injectable()


export class AuthGuardCo implements CanActivate {
/**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    
    constructor( private _fuseConfigService: FuseConfigService,private router: Router) { }
   
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        // if ((localStorage.getItem('currentUser')) && (localStorage.getItem('userType')=='Super Admin')) {
        if (localStorage.getItem('currentUser')) {

            
            if(localStorage.getItem('userType')=='Merchant')
            {
                {
                    setTimeout(function(){
                        localStorage.removeItem("currentUser");
                    }, 5000*60*60);
        
                     return true;
                }
            }
            // logged in so return true
           
            

        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        return false;
    }
    

    
}