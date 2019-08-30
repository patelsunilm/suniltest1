import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

import { UsersService } from '../../_services/index';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations
})


export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['image', 'email', 'firstname', 'lastname', 'phone', 'action'];
  dataSource;
  form: FormGroup;
  allappusers: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isTableHasData = true;
  isTableHasDataAgain = true;
  applyFilter(filterValue: any) {
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
  constructor(public dialog: MatDialog, private UsersService: UsersService) { }

  openDialog() {

    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {

    this.UsersService.GetallUsersDetails()
      .subscribe(
        data => {
          this.allappusers = data;
          const users = data
          const allappusers = [];
          users.forEach(element => {

            allappusers.push(element);

          });

          if (allappusers.length > 0) {
            this.dataSource = new MatTableDataSource(allappusers);
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


  deleteuser(id) {

    let dialogRef = this.dialog.open(deleteproductPopupComponent, {
      data: {
        userid: id
      },
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      var userId = localStorage.getItem('userId');
      this.UsersService.GetallUsersDetails()
        .subscribe(
          data => {
            this.allappusers = data;
            const users = data
            const allappusers = [];
            users.forEach(element => {

              allappusers.push(element);

            });

            if (allappusers.length > 0) {
              this.dataSource = new MatTableDataSource(allappusers);
              this.dataSource.paginator = this.paginator;
              this.isTableHasDataAgain = true;
            } else {
              this.isTableHasDataAgain = false;
            }

          },
          error => {
            console.log(error);
          });

    })
  }

}


@Component({
  selector: 'deleteuser-popup',
  templateUrl: './deleteuserpopup.html'
})
export class deleteproductPopupComponent {
  returnUrl: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  dataSource;
  allappusers:any;
  isTableHasData = true;
  isTableHasDataAgain = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private ProductService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private UsersService: UsersService

  ) {


  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  deleteappuser(userid) {
    this.UsersService.deleteappuser(userid)
      .subscribe(
        data => {

          this.snackBar.open('User deleted successfully.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.router.navigate([this.returnUrl]);
          this.UsersService.GetallUsersDetails()
          .subscribe(
            data => {
              this.allappusers = data;
              const users = data
              const allappusers = [];
              users.forEach(element => {
  
                allappusers.push(element);
  
              });
  
              if (allappusers.length > 0) {
                this.dataSource = new MatTableDataSource(allappusers);
                this.dataSource.paginator = this.paginator;
                this.isTableHasDataAgain = true;
              } else {
                this.isTableHasDataAgain = false;
              }
  
            },
            error => {
              console.log(error);
            });
        },
        error => {
          console.log(error);

        });

  }
}
export class DialogContentExampleDialog { }
