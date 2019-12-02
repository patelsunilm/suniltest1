import { Component, OnDestroy, OnInit, TemplateRef,ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import * as $ from 'jquery';
import { AuthenticationService } from '../../_services/index';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { id } from '@swimlane/ngx-charts/release/utils';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    animations: fuseAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {

    form: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    urls = new Array<string>();
    filesToUpload: Array<File> = [];
    image: any;
    // Private
    allcountries: any;
    merchantcategories: any;
    allstates: any;
    citys: any;
    a: any;
    backgroundfilesToUpload: Array<File> = [];
    urls1 = new Array<string>();
    private _unsubscribeAll: Subject<any>;
    backgroundimage: any;
    newfileuplodes: Array<File> = [];
    newfileuplodes1: Array<File> = [];
    public rgbaText: string = 'rgba(165, 26, 214, 0.2)';
    newtesting: any;
    public cmykValue: string = '';

    public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);

    imageprofiles: any;
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
    public loading = false;
    public primaryColour = PrimaryWhite;
    public secondaryColour = SecondaryGrey;
    public coloursEnabled = false;
    public loadingTemplate: TemplateRef<any>;
    public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };
   

    constructor(

        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ProfileService: ProfileService,
        public snackBar: MatSnackBar,
        private AuthenticationService: AuthenticationService
    ) {
        // Set the private defaults

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
            image: [''],
            merchantcatname: ['', Validators.required],
            countries: ['', Validators.required],
            states: ['', Validators.required],
            city: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
        this.route.params.subscribe(params => {
            this.ProfileService.getprofileInfo(user._id)
                .subscribe(

                    data => {

                        this.image = data.image
                        this.backgroundimage = data.backgroundImage
                        this.form = this._formBuilder.group({
                            name: [data.name],
                            email: [data.email, [Validators.required, Validators.email]],
                            address: [data.address],
                            businessname: [data.businessname],
                            Secretquestion: [data.secretquestion],
                            Secretanswer: [data.secretanswer],
                            backgroundtheme: [data.backgroundtheme],
                            fontcolor: [data.fontcolor],
                            image: [this.image],
                            merchantcatname: [data.merchantcatid],
                            countries: [data.countryid],
                            states: [data.stateid],
                            city: [parseInt(data.cityid)],
                            backgroundimage: [this.backgroundimage]
                        });

                        this.ProfileService.getallstates(data.countryid)
                            .subscribe(
                                data => {
                                    this.allstates = data.data;
                                },
                                error => {
                                    // console.log(error);
                                });
                        var num = data.stateid;
                        if (num == undefined || num == "undefined") {
                        } else {
                            var n = num.toString();
                        }
                        this.ProfileService.getallcity(n)
                            .subscribe(
                                data => {
                                    if (data.message == "No records found") {
                                    } else {
                                        this.citys = data.data
                                    }
                                },
                                error => {

                                    // console.log(error);
                                });
                    },

                    error => {
                        // console.log(error);

                    });
        });

        this.AuthenticationService.getmerchantcategories()
            .subscribe(data => {
                this.merchantcategories = data;
            },
                error => {
                    // console.log(error);
                });


        this.ProfileService.getAllcountries()
            .subscribe(data => {
                this.allcountries = data.data;
            },
                error => {
                    // console.log(error);
                });
    }



    selectcountries(stateid) {
        if (stateid == undefined || stateid == 'undefined') {
        
        } else {
           
            
            this.form.controls['states'].setValue('')
            
            //  this.form.addControl('states',this.form.controls('', validators));
            this.form.controls['states'].setValidators([Validators.required]);


            var id = stateid.toString();
            
            this.ProfileService.getallstates(id)
                .subscribe(
                    data => {
                        if (data.message == "No records found") {
                           
                        } else {
                           
                            this.allstates = data.data;
                        }
                    },
                    error => {

                        // console.log(error);
                    });
        }

    }

    selectstate(cityid) {

        if (cityid == undefined || cityid == 'undefined') {

        } else {
            this.form.controls['city'].setValue('')
            this.ProfileService.getallcity(cityid)
                .subscribe(
                    data => {
                        if (data.message == "No records found") {

                        } else {
                            this.citys = data.data
                        }
                    },
                    error => {

                        // console.log(error);
                    });

        }
        
    }

    fileChangeEvent(fileInput: any, index) {

        var imagefiles = fileInput.target.files;

        if (fileInput.target.files && fileInput.target.files[0]) {
            var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");

            if (!(regex.test(fileInput.target.value.toLowerCase()))) {
                fileInput.target.value = ''
                this.snackBar.open('Please select correct file format', '', {
                    duration: 3000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });

            } else {

                var testreader = new FileReader();
                testreader.onload = (fileInput: any) => {
                    this.urls[index] = fileInput.target.result;
                    this.filesToUpload.push(imagefiles[0]);
                    this.newfileuplodes.push(imagefiles[0]);
                }
                testreader.readAsDataURL(fileInput.target.files[0]);
            }
        }
    }


    fileChangeEvent1(fileInput: any, index) {

        var imagefiles = fileInput.target.files;
        if (fileInput.target.files && fileInput.target.files[0]) {
            var regex = new RegExp("(.*?)\.(jpg|jpeg|png|raw|tiff)$");
            if (!(regex.test(fileInput.target.value.toLowerCase()))) {
                fileInput.target.value = ''
                this.snackBar.open('Please select correct file format', '', {
                    duration: 3000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
            } else {
                var testreader1 = new FileReader();
                testreader1.onload = (fileInput: any) => {
                    this.urls1[index] = fileInput.target.result;

                    this.backgroundfilesToUpload.push(imagefiles[0]);
                    this.newfileuplodes1.push(imagefiles[0])
                }
                testreader1.readAsDataURL(fileInput.target.files[0]);
            }
        }
    }


    readLocalStorageValue(key) {
        return localStorage.getItem(key);
    }

    updatemyprofile() {

        this.loading = true
        var user = JSON.parse(localStorage.getItem('currentUser'));
        this.route.params.subscribe(params => {
           
           
            if (this.filesToUpload.length > 0 || this.backgroundfilesToUpload.length > 0) {
                var background = [];
                var data = this.filesToUpload.slice(-1);
                var data1 = this.backgroundfilesToUpload.slice(-1);
                var image;
                if (data[0] == undefined) {
                    image = ""
                } else {
                    image = data[0]
                }

                var backgroundimage;

                if (data1[0] == undefined) {

                    backgroundimage = ""
                } else {
                    backgroundimage = data1[0]
                }

                background.push(image, backgroundimage);
                this.ProfileService.uploadLogoImage(background)
                    .subscribe(data => {
                        data.sort(function (obj1, obj2) {
                            return obj1.index - obj2.index;

                        });
                        if (image) {
                            this.form.value.image = data[0].s3url.toString();
                        }
                        if (backgroundimage) {
                            if (image) {
                                this.form.value.backgroundimage = data[1].s3url.toString();
                            } else {
                                this.form.value.backgroundimage = data[0].s3url.toString();
                            }
                        }
                        this.form.value._id = user._id;
                        this.form.value.userType = user.userType;
                        this.form.value.fontcolor = $("#fontcolor").val()
                        this.form.value.backgroundtheme = $("#backgroundthemecolor").val()
                        this.ProfileService.updateprofile(this.form.value)
                            .subscribe(
                                data => {

                                    if (data.string == "Email already exist.") {
                                        this.snackBar.open("Email already exists.", '', {
                                            duration: 3000,
                                            horizontalPosition: this.horizontalPosition,
                                            verticalPosition: this.verticalPosition,
                                        });
                                        this.loading = false

                                    } else if (data.string == "Business name already exists.") {
                                        this.snackBar.open('Business name already exists.', '', {
                                            duration: 3000,
                                            horizontalPosition: this.horizontalPosition,
                                            verticalPosition: this.verticalPosition,
                                        });
                                        this.loading = false

                                    } else {
                                        this.snackBar.open('Profile updated successfully.', '', {
                                            duration: 3000,
                                            horizontalPosition: this.horizontalPosition,
                                            verticalPosition: this.verticalPosition,
                                        });
                                        this.loading = false

                                        this.router.navigate([this.returnUrl]);
                                    }

                                },
                                error => {
                                    this.snackBar.open('Please try again!', '', {
                                        duration: 3000,
                                        horizontalPosition: this.horizontalPosition,
                                        verticalPosition: this.verticalPosition,
                                    });
                                    this.loading = false

                                    this.router.navigate([this.returnUrl]);

                                });
                    });

            } else {
                this.loading = true

                this.form.value._id = user._id;
                this.form.value.userType = user.userType;
                this.form.value.fontcolor = $("#fontcolor").val()
                // this.form.value.backgroundtheme = $('#backgroundthemecolor').val().replace(/rgb/g, "rgba");
                this.form.value.backgroundtheme = $("#backgroundthemecolor").val()
                this.ProfileService.updateprofile(this.form.value)
                    .subscribe(
                        data => {
                            if (data.string == "Email already exist.") {
                                this.snackBar.open('Email already exists.', '', {
                                    duration: 3000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                });
                                this.loading = false

                            } else if (data.string == "Business name already exists.") {
                                this.snackBar.open('Business name already exists.', '', {
                                    duration: 3000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                });
                                this.loading = false

                            } else {
                                this.snackBar.open('Profile updated successfully.', '', {
                                    duration: 3000,
                                    horizontalPosition: this.horizontalPosition,
                                    verticalPosition: this.verticalPosition,
                                });
                                this.loading = false

                                this.router.navigate([this.returnUrl]);
                            }

                        },
                        error => {
                            this.snackBar.open('Please try again!', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                            this.loading = false

                            this.router.navigate([this.returnUrl]);
                        });
            }

        })
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
