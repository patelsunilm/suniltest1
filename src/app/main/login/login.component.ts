import { Component, OnInit, ViewEncapsulation, Inject, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

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
        public snackBar: MatSnackBar
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

                    if (data.userType == "Merchant") {

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
                            // this.AuthenticationService.getallMerchentsData()
                            //     .subscribe(
                            //         data => {

                            //         },
                            //         error => {
                            //             console.log(error);
                            //         });
                        });
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
                   
                    if (data.string == 'Invalid credentials.') {
                        this.snackBar.open('Invalid credentials.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    
                    }else{
                       
                        if (localStorage.getItem('currentUser')) {

                            this.router.navigate(['dashboard']);

                        }
                    }
                },
                error => {
                    console.log(error);
                });
    }

}
export class DialogContentExampleDialog { }