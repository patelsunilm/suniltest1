import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';

// import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { FuseConfigService } from '@fuse/services/config.service';

@Injectable()


export class AuthGuardCommon implements CanActivate {

    constructor( private _fuseConfigService: FuseConfigService,private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // if ((localStorage.getItem('currentUser')) && (localStorage.getItem('userType')=='Super Admin')) {
        if (localStorage.getItem('currentUser')) {
            {
                setTimeout(function(){
                    localStorage.removeItem("currentUser");
                }, 5000*60*60);
    
                 return true;
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