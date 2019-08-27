import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

export interface PeriodicElement {


  proName: string;
  costprice: string;
  markup: string;
  sellingprice: string;
  date: string;
  image: string;
  tilltype: boolean;
  stocklevel: boolean;
  action: string;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: fuseAnimations
})


export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'proName', 'costprice', 'markup', 'sellingprice', 'date', 'tilltype', 'stocklevel', 'action'];
  dataSource;
  form: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isTableHasData = true;
  isTableHasDataAgain = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;


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


  public showAlert(): void {
    alert('ngx-loading rocks!');
  }
  constructor(public dialog: MatDialog, private ProductService: ProductService, public snackBar: MatSnackBar) { }
  openDialog() {

    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit() {
    var userId = localStorage.getItem('userId');
    this.ProductService.getproducts(userId)
      .subscribe(
        data => {

          if (data.length > 0) {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;
          } else {
            this.isTableHasDataAgain = false;
          }

        }, error => {
          console.log(error);
        });
  }


  deleteproduct(id) {


    
    let dialogRef = this.dialog.open(deleteproductPopupComponent, {
      data: {
        productid: id
      },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      var userId = localStorage.getItem('userId');

      this.ProductService.getproducts(userId)
        .subscribe(
          data => {

            if (data.length > 0) {
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.isTableHasDataAgain = true;
            } else {
              this.isTableHasDataAgain = false;
            }


          }, error => {
            console.log(error);
          });

    })
  }

  fileEvent($event) {

    var regex = new RegExp("(.*?)\.(csv)$");

    if (!(regex.test($event.target.value.toLowerCase()))) {

      $event.target.value = '';
      this.snackBar.open('Please select correct file format', '', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

    } else {

      var userId = localStorage.getItem('userId');

      $event.target.files[0].userId = userId

      this.ProductService.addcsvfile($event.target.files[0]).subscribe(data => {

        if (data.string == "Csv import success fully") {
          this.snackBar.open('Csv import success fully', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          var userId = localStorage.getItem('userId');



          this.ProductService.getproducts(userId)
            .subscribe(
              data => {

                if (data.length > 0) {
                  this.dataSource = new MatTableDataSource(data);
                  this.dataSource.paginator = this.paginator;
                  this.isTableHasDataAgain = true;
                } else {
                  this.isTableHasDataAgain = false;
                }


              }, error => {
                console.log(error);
              });
        } else {

          this.snackBar.open('please correct csv file select', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        }
      }, error => {
        console.log(error);
      })
    }

  }


}
@Component({
  selector: 'deleteproduct-popup',
  templateUrl: './deleteproductpopup.html'
})
export class deleteproductPopupComponent {
  returnUrl: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private ProductService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar

  ) {


  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/companies';
  }

  delete(id) {

    this.ProductService.deleteoneproduct(id)
      .subscribe(
        data => {

          this.snackBar.open('Product deleted successfully', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });

        })

  }
}
export class DialogContentExampleDialog { }
