import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import * as $ from 'jquery';

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


    public rgbaText: string = 'rgba(165, 26, 214, 0.2)';

    public arrayColors: any = {
        color1: '#2883e9',
        color2: '#e920e9',
        color3: 'rgb(255,245,0)',
        color4: 'rgb(236,64,64)',
        color5: 'rgba(45,208,45,1)'
    };

    public selectedColor: string = 'color1';

    public color1: string = '#2889e9';
    public color2: string = '#e920e9';
    public color3: string = '#fff500';
    public color4: string = 'rgb(236,64,64)';
    public color5: string = 'rgba(45,208,45,1)';
    public color6: string = '#1973c0';
    public color7: string = '#f200bd';
    public color8: string = '#a8ff00';
    public color9: string = '#278ce2';
    public color10: string = '#0a6211';
    public color11: string = '#f2ff00';
    public color12: string = '#f200bd';
    public color13: string = 'rgba(0,255,0,0.5)';
    public color14: string = 'rgb(0,255,255)';
    public color15: string = 'rgb(255,0,0)';
    public color16: string = '#a51ad633';
    public color17: string = '#666666';
    public color18: string = '#ff0000';

    public cmykValue: string = '';

    public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);


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
            backgroundtheme: [''],
            fontcolor: [''],
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
                            backgroundtheme: [data.backgroundtheme],
                            fontcolor: [data.fontcolor],

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
        this.route.params.subscribe(params => {
            this.form.value._id = user._id;
            this.form.value.userType = user.userType;
            this.form.value.fontcolor = $("#fontcolor").val()
            this.form.value.backgroundtheme = $("#backgroundthemecolor").val()

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
