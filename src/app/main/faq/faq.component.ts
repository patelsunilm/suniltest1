import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ɵConsole } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FAQService } from '../../_services/index';


@Component({
    selector: 'faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FaqComponent implements OnInit, OnDestroy {
    faqsvalue: any;
    merchantname: any;
    mydatalength: any;
    Form: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FaqService} _faqService
     */
    constructor(
        private FAQService: FAQService,
        public dialog: MatDialog,
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
        this.FAQService.getAllfaqs()
            .subscribe(
                data => {

                    this.faqsvalue = data
                    this.merchantname = data
                    this.mydatalength = data.length
                },
                error => {

                    console.log(error);
                });
    }

    readLocalStorageValue(key) {
        return localStorage.getItem(key);
    }

    addFaq(id) {


        let dialogRef = this.dialog.open(FaqPopupComponent, {
            data: {
                _id: id
            },
            width: '450px'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.FAQService.getAllfaqs()
                .subscribe(
                    data => {
                        this.faqsvalue = data
                        this.merchantname = data
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
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}


@Component({
    selector: 'faq-popup',
    templateUrl: './faqpopup.html'
})
export class FaqPopupComponent {
    Form: FormGroup;
    returnUrl: string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    faqsvalue: any;
    merchantname: any;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private FAQService: FAQService,
        private route: ActivatedRoute,
        private router: Router,
        public snackBar: MatSnackBar,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,

    ) {


    }
    ngOnInit() {
        var userId = localStorage.getItem('userId');
        this.Form = this._formBuilder.group({
            userId: userId,
            faqquestion: [''],
            faqanswer: [''],
            status: false
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/faq';
    }

    readLocalStorageValue(key) {
        return localStorage.getItem(key);
    }


    submitFaq() {
        this.FAQService.addfaqData(this.Form.value)

            .subscribe(
                data => {
                    if (data.string == 'Please enter question you can not submit an empty field.') {
                        this.snackBar.open('Please enter question you can not submit an empty field.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else {
                        this.snackBar.open('Faq question added successfully.', '', {
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

    submitAnswerFaq(id) {
        this.Form.value.faqId = id;
        this.FAQService.addFaqAnswerByAdmin(this.Form.value)
            .subscribe(
                data => {
                    if (data.string == 'Please enter answer you can not submit an empty field.') {
                        this.snackBar.open('Please enter answer you can not submit an empty field.', '', {
                            duration: 3000,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                        });
                    } else {
                        this.snackBar.open('Faq answer added successfully.', '', {
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

}
export class DialogContentExampleDialog { }
