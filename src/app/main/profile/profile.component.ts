import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {

    form: FormGroup;
    lat: number;
    lng: number;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    packagename: any[];
    latnew: any;
    longnew: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ProfileService: ProfileService,
        public snackBar: MatSnackBar,
    ) {
        // Set the private defaults
        this.lat = -34.397;
        this.lng = 150.644;

        this._unsubscribeAll = new Subject();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        var user = JSON.parse(localStorage.getItem('currentUser'));
        this.form = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            businessname: ['', Validators.required],
            Secretquestion: ['', Validators.required],
            Secretanswer: ['', Validators.required],
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';


        this.route.params.subscribe(params => {
            this.ProfileService.getprofileInfo(user._id)
                .subscribe(
                    data => {

                        this.form = this._formBuilder.group({

                            name: [data.name],
                            email: [data.email],
                            address: [data.address],
                            businessname: [data.businessname],
                            Secretquestion: [data.secretquestion],
                            Secretanswer: [data.secretanswer],
                        });
                    },
                    error => {
                        console.log(error);

                    });

        });

    }

    readLocalStorageValue(key) {
        return localStorage.getItem(key);
    }

    updatemyprofile() {

        var user = JSON.parse(localStorage.getItem('currentUser'));
        console.log(user)
        this.route.params.subscribe(params => {
            this.form.value._id = user._id;
            this.form.value.userType = user.userType;
            this.ProfileService.updateprofile(this.form.value)
                .subscribe(
                    data => {

                        if (data.string == 'Email is already exist.') {
                            this.snackBar.open('Email is already exist.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        } if (data.string == 'BusinessName is already exist.') {
                            this.snackBar.open('BusinessName is already exist.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        } else {
                            this.snackBar.open('Profile updated successfully.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                            this.router.navigate([this.returnUrl]);
                        }


                    },
                    error => {

                        console.log(error);
                        this.snackBar.open('Please try again!', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                        this.router.navigate([this.returnUrl]);

                    });
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
