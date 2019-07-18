import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MerchantService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';

@Component({
    selector: 'app-updatemerchant',
    templateUrl: '../updatemerchant/updatemerchant.component.html',
    styleUrls: ['../updatemerchant/updatemerchant.component.scss'],
    animations: fuseAnimations
})
export class UpdateMerchantComponent implements OnInit, OnDestroy {
    form: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    returnUrl: string;
    hide = true;


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
        private MerchantService: MerchantService,
        public snackBar: MatSnackBar,

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
        // Reactive Form
        this.form = this._formBuilder.group({
            name: ['', Validators.required],
            address: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            businessname: ['', Validators.required],
            status: false,
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/merchant';

        this.route.params.subscribe(params => {
            this.MerchantService.getmerchantDatabyId(params.id)
                .subscribe(
                    data => {

                        this.form = this._formBuilder.group({
                            name: [data.name, Validators.required],
                            address: [data.address, Validators.required],
                            email: [data.email, [Validators.required, Validators.email]],
                            businessname: [data.businessname, Validators.required],
                            status: [data.status, Validators.required]
                        });
                    },
                    error => {
                        console.log(error);

                    });

        });

    }


    updatemerchantData() {

        this.route.params.subscribe(params => {
            this.form.value._id = params.id;


            this.MerchantService.updatemerchantData(this.form.value)
                .subscribe(
                    data => {

                        if (data.string == 'Email is already exist.') {
                            this.snackBar.open('Email is already exist.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        } else if (data.string == 'Business Name is already exist.') {
                            this.snackBar.open('Business Name is already exist.', '', {
                                duration: 3000,
                                horizontalPosition: this.horizontalPosition,
                                verticalPosition: this.verticalPosition,
                            });
                        } else {
                            this.snackBar.open('Merchant updated successfully.', '', {
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
