import { Injectable } from '@angular/core';
import { Router, CanActivate,CanActivateChild,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from } from 'rxjs';

// import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

@Injectable()


export class AuthGuardCo implements CanActivate {

    constructor(private router: Router) { }
   
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        // if ((localStorage.getItem('currentUser')) && (localStorage.getItem('userType')=='Super Admin')) {
        if (localStorage.getItem('currentUser')) {

            
            if(localStorage.getItem('userType')=='Company')
            {
                setTimeout(function(){
                    localStorage.removeItem("currentUser");
                }, 1000*60*60);
    
                 return true;
            }
            // logged in so return true
           
            

        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    

    
}