import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ForgotPasswordService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';


import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: 'forgot-password-2',
    templateUrl: './forgot-password-2.component.html',
    styleUrls: ['./forgot-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPassword2Component implements OnInit {
    forgotPasswordForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    disabled: any;
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder,
     * 
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ForgotPasswordService: ForgotPasswordService,
        public snackBar: MatSnackBar,
    ) {
        this._unsubscribeAll = new Subject();

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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/#/login';
    }



    sendforgotpasswordlink() {
       
        this.ForgotPasswordService.sendlink(this.forgotPasswordForm.value)
            .subscribe(
                data => {

                    if (data.string == 'Account does not exist.') {
                        this.snackBar.open('Account does not exist.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else {
                        
                        this.snackBar.open('Email send successfully.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                        this.router.navigate([this.returnUrl]);

                    }

                },
                error => {

                    console.log(error);
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
