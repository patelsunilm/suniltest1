import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ChangePasswordService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';


@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    animations: fuseAnimations
})
export class PasswordComponent implements OnInit, OnDestroy {
    form: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    hide = true;
    hideagain = true;
    Confirmhide = true;
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
        private ChangePasswordService: ChangePasswordService,
        public snackBar: MatSnackBar,
    ) {
        this._unsubscribeAll = new Subject();
    }



    ngOnInit(): void {

        this.form = this._formBuilder.group({
            oldPassword: ['', { validators: [Validators.minLength(6)] }],
            newPassword: ['', { validators: [Validators.minLength(6)] }],
            confirmPassword: ['', { validators: [Validators.minLength(6)] }],
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    passwordmatch() {

        if (this.form.value.newPassword == this.form.value.confirmPassword) {

            this.ChangePasswordService.passwordmatch(this.form.value)

                .subscribe(
                    data => {
                        if (data.string == 'Password matched successfully.') {
                            this.snackBar.open('Password matched successfully.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        }
                        else if (data.string == 'Password unmatched.') {
                            this.snackBar.open('Password unmatched.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        }
                        else if (data.string == 'Your Password Is Same As Old Password Please Enter Another Password') {
                            this.snackBar.open('Your password is same as old password please enter another password', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        }
                        else {
                            this.snackBar.open('Password changed successfully.', '', {
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


        } else {
            this.snackBar.open('Please check your New Password and Confirm Password.', '', {
                duration: 3000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });
        }

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

