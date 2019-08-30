import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import { OrdersService } from '../../../_services/index';

export interface PeriodicElement {

  image: string;
  productName: string;
  costPrice: number;
  markUp: number;
  sellingPrice: number;
  quantity: number;
  status: string;
}



@Component({
  selector: 'app-productorderdetails',
  templateUrl: './productorderdetails.component.html',
  styleUrls: ['./productorderdetails.component.scss'],
  animations: fuseAnimations
})


export class ProductorderdetailsComponent implements OnInit {

  productdata: any;
  statusdata: any;
  displayedColumns: string[] = ['image', 'productName', 'costPrice', 'markUp', 'sellingPrice', 'quantity', 'status'];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  constructor(public dialog: MatDialog,
    private OrdersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {



    this.route.params.subscribe(params => {
      this.OrdersService.getAllproductorderdetails(params.id)
        .subscribe(
          data => {
            this.statusdata = data.status
            this.productdata = data.productdetails;
            const myproductdata = data.productdetails;
            const productdata = [];
            myproductdata.forEach(element => {
              productdata.push(element);
            });
            this.dataSource = new MatTableDataSource(productdata);
            this.dataSource.paginator = this.paginator;
          },
          error => {
            console.log(error);

          });

    });
  }

}

export class DialogContentExampleDialog { }
