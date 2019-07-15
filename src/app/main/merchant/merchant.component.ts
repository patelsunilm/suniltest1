import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MerchantService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';


export interface PeriodicElement {

    name: string;
    address: string;
    email: string;
    businessname: string;
    status: Boolean;
    action: string;
}



@Component({
    selector: 'app-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.scss'],
    animations: fuseAnimations
})


export class MerchantComponent implements OnInit {

    allmerchantdata: any[];
    displayedColumns: string[] = ['name', 'address', 'email', 'businessname', 'status', 'action'];
    dataSource;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    constructor(public dialog: MatDialog,
        private MerchantService: MerchantService
    ) { }

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentExampleDialog);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnInit() {
        this.MerchantService.getallMerchentsData()
            .subscribe(
                data => {
                    this.allmerchantdata = data;
                    const merchantdata = data;
                    const allmerchantdata = [];
                    merchantdata.forEach(element => {

                        allmerchantdata.push(element);

                    });
                    this.dataSource = new MatTableDataSource(allmerchantdata);
                    this.dataSource.paginator = this.paginator;
                },
                error => {
                    console.log(error);
                });
    }


    merchantStatusToggle(status, id) {

        this.MerchantService.merchantStatusToggle(status.checked, id)
            .subscribe(
                data => {

                },
                error => {
                    console.log(error);
                });
    }

    deletemerchant(id, name) {

        let dialogRef = this.dialog.open(deletemerchantpopupComponent, {
            data: {
                merchantId: id,
                name: name,
            },
            width: '450px'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.MerchantService.getallMerchentsData()
                .subscribe(
                    data => {
                        this.allmerchantdata = data;
                        const merchantdata = data;
                        const allmerchantdata = [];
                        merchantdata.forEach(element => {

                            allmerchantdata.push(element);

                        });
                        this.dataSource = new MatTableDataSource(allmerchantdata);
                        this.dataSource.paginator = this.paginator;
                    },
                    error => {
                        console.log(error);
                    });
        });
    }

}

@Component({
    selector: 'deletemerchant-popup',
    templateUrl: './deletemerchantpopup.html'
})
export class deletemerchantpopupComponent {
    returnUrl: string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private MerchantService: MerchantService,
        private route: ActivatedRoute,
        private router: Router,
        public snackBar: MatSnackBar

    ) {


    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/merchant';
    }

    delete(id, name) {
        this.MerchantService.deletemerchantData(id, name)
            .subscribe(
                data => {

                    this.snackBar.open('Merchant deleted successfully.', '', {
                        duration: 5000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                    });
                    this.router.navigate([this.returnUrl]);

                },
                error => {
                    console.log(error);
                });

    }

}

export class DialogContentExampleDialog { }
