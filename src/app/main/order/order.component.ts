import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import { OrdersService } from '../../_services/index';

export interface PeriodicElement {

  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  action: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: fuseAnimations
})


export class OrderComponent implements OnInit {
  myid: any;
  appusersdata: any;
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'action'];
  dataSource;
  isTableHasData = true;
  isTableHasDataAgain = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // applyFilter(filterValue: any) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }

  // }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

   
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length > 0) {

      this.isTableHasData = true;
    } else {

      this.isTableHasData = false;
    }
  }

  constructor(public dialog: MatDialog,
    private OrdersService: OrdersService
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {

    var merchantid = localStorage.getItem('userId');
    this.OrdersService.getAllorders()
      .subscribe(
        data => {

          this.appusersdata = data;
          const myappdata = data;
          const appusersdata = [];
          // myappdata.forEach(element => {
          //   appusersdata.push(element);
          // });
          myappdata.forEach(entry => {
            this.myid = entry._id;
            entry.appuserdata.forEach(element => {
              appusersdata.push(element);
            })
          })

          if (appusersdata.length > 0) {
            this.dataSource = new MatTableDataSource(appusersdata);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;

          } else {

            this.isTableHasDataAgain = false;
          }

        },
        error => {

          console.log(error);
        });

  }

}

export class DialogContentExampleDialog { }
