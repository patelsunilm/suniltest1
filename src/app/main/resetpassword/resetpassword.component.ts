import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ForgotPasswordService } from '../../_services/index';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
    selector: 'resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPasswordComponent implements OnInit {
    loginForm: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    hide = true;
    hideagain = true;
    returnUrl: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ForgotPasswordService: ForgotPasswordService,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar
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


        this.loginForm = this._formBuilder.group({
            newPassword: ['', { validators: [Validators.minLength(6)] }],
            confirmPassword: ['', { validators: [Validators.minLength(6)] }],
        });

    }

    resetpassword() {

        if (this.loginForm.value.newPassword == this.loginForm.value.confirmPassword) {
            this.route.params.subscribe(params => {
                this.loginForm.value.userid = params.id;

                this.ForgotPasswordService.resetpassword(this.loginForm.value)
                    .subscribe(
                        data => {

                            var msg = data.msg ? data.msg : 'Password changed successfully.';
                            this.snackBar.open(msg, '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                            if (!data.msg) {
                                this.router.navigate(['/login']);
                            }
                        }, error => {

                            this.snackBar.open('Please Try Again!', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                            //this.router.navigate([this.returnUrl]);
                        });
            });
        } else {

            this.snackBar.open('Password unmatched.', '', {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });

        }
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
