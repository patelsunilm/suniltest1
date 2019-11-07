import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';

// import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

@Injectable()
export class AuthGuard implements CanActivate {

/**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    
    constructor(  private _fuseConfigService: FuseConfigService,private router: Router) { }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // if ((localStorage.getItem('currentUser')) && (localStorage.getItem('userType')=='Super Admin')) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            if (localStorage.getItem('userType') == 'admin') {
                {
                    setTimeout(function(){
                        localStorage.removeItem("currentUser");
                    }, 5000*60*60);
        
                     return true;
                }
            }

        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
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

