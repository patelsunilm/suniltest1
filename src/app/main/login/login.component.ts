import { Component, OnInit, ViewEncapsulation, Inject, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'login-2',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Login2Component implements OnInit {
    loginForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    hide = true;
    ipAddress: any;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private AuthenticationService: AuthenticationService,
        public snackBar: MatSnackBar,
        private http: HttpClient,
    ) {
        // Configure the layout
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

        // this.http.get<{ ip: string }>('https://jsonip.com')
        //     .subscribe(data => {

        //         this.ipAddress = data.ip
        //         console.log('new')
        //         console.log(this.ipAddress);
        //     })
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentExampleDialog);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.loginForm = this._formBuilder.group({
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
        localStorage.removeItem('userType');
    }

    login() {

        this.AuthenticationService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
            .subscribe(
                data => {

                    this.ipAddress = '27.121.104.92'
                    if (data.string == 'You cannot logged in as your Status is off.') {
                        this.snackBar.open('You cannot logged in as your Status is off.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else if (data.userType == "Merchant") {

                        if (this.ipAddress == data.ipaddress) {
                            if (localStorage.getItem('currentUser')) {

                                this.router.navigate(['dashboard']);

                            }
                        } else {
                            let dialogRef = this.dialog.open(secretvaluepopupComponent, {
                                data: {
                                    id: data._id,
                                    secretanswer: data.secretanswer,
                                    secretquestion: data.secretquestion,
                                },
                                width: '450px'
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                dialogRef.close()
                            });
                        }

                    } else {

                        if (localStorage.getItem('currentUser')) {

                            this.router.navigate(['dashboard']);

                        }

                    }

                },
                error => {

                    this.snackBar.open('Invalid credentials.', '', {
                        duration: 3000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                });

    }


}

@Component({
    selector: 'secretvalu-popup',
    templateUrl: './secretvaluepopup.html'
})
export class secretvaluepopupComponent {
    ipAddress: any;
    loginForm: FormGroup;
    returnUrl: string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private AuthenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        public snackBar: MatSnackBar,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,

    ) {


    }
    ngOnInit() {

        this.loginForm = this._formBuilder.group({
            secretquestion: [''],
            secretanswer: [''],
        });




    }

    submit(_id) {

        this.AuthenticationService.addsecretValuedata(_id, this.loginForm.value)
            .subscribe(
                data => {

                    if (data.string == 'Please enter right secret answer.') {
                        this.snackBar.open('Please enter right secret answer.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });

                    } else {

                        if (localStorage.getItem('currentUser')) {

                            this.router.navigate(['dashboard']);

                        }
                    }
                },
                error => {
                    console.log(error);
                });
    }

    updateip(_id) {

        this.ipAddress = '27.121.104.92'
        this.loginForm.value.ipAddress = this.ipAddress;
        this.loginForm.value._id = _id;

        this.AuthenticationService.updateipaddress(this.loginForm.value)
            .subscribe(
                data => {

                },
                error => {

                    console.log(error);
                });
    }
}
export class DialogContentExampleDialog { }