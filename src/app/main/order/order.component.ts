import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';



export interface PeriodicElement {

  // name: string;
  // address: string;
  // email: string;
  // businessname: string;
  // status: Boolean;
  // action: string;
}



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: fuseAnimations
})


export class OrderComponent implements OnInit {


  //displayedColumns: string[] = ['name', 'address', 'email', 'businessname', 'status', 'action'];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  constructor(public dialog: MatDialog,

  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {


  }

}

export class DialogContentExampleDialog { }
