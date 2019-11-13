import { Component,ElementRef, Renderer2,OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { OnDestroy, TemplateRef } from '@angular/core';
import { Subject, from } from 'rxjs';
import * as $ from 'jquery';

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
// ,'qrcodeImage'

export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'proName', 'costprice', 'markup', 'sellingprice', 'date', 'tilltype','tilltypeName', 'stocklevel','qrcodeImage', 'action'];
  dataSource;
  form: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isTableHasData = true;
  isTableHasDataAgain = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  url : any;

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
  @ViewChild('fileInput')
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  myInputVariable: ElementRef;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate: TemplateRef<any>;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };

  // Private
  private _unsubscribeAll: Subject<any>;
  // Private

  public toggleColours(): void {
    this.coloursEnabled = !this.coloursEnabled;

    if (this.coloursEnabled) {
      this.primaryColour = PrimaryRed;
      this.secondaryColour = SecondaryBlue;
    } else {
      this.primaryColour = PrimaryWhite;
      this.secondaryColour = SecondaryGrey;
    }
  }

  public showAlert(): void {
    alert('ngx-loading rocks!');
  }
  constructor( private renderer: Renderer2,public dialog: MatDialog, private ProductService: ProductService, public snackBar: MatSnackBar) { }
  openDialog() {

    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  oneimages : any;
  ngOnInit() {
    var userId = localStorage.getItem('userId');
   

    this.ProductService.getproducts(userId)
      .subscribe(
        data => {
         
          if (data.length > 0) {
          
            // this.image = "./assets/uploads/157355285282819qr.png"
            // this.dataSource = new MatTableDataSource(data);
            // this.dataSource.paginator = this.paginator;
            // this.isTableHasDataAgain = true;
          
            const allproducts = [];
             data.forEach(element => {
              
              this.oneimages = "assets/uploads/" +element.qrcodeImage
              element.qrcodeImage  = "assets/uploads/" +element.qrcodeImage;
               allproducts.push(element);
  
            });
  
  
            if (allproducts.length > 0) {
              this.dataSource = new MatTableDataSource(allproducts);
              this.dataSource.paginator = this.paginator;
              this.isTableHasDataAgain = true;
  
            } else {
              this.isTableHasDataAgain = false;
  
            }

          } else {
            this.isTableHasDataAgain = false;
          }

        }, error => {
          console.log(error);
        });
  }


  deleteproduct(id ) {

    let dialogRef = this.dialog.open(deleteproductPopupComponent, {
      data: {
        productid: id,
        
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
     this.loading = true;
    var regex = new RegExp("(.*?)\.(xlsx|xls|csv)$");
  
    if (!(regex.test($event.target.value.toLowerCase()))) {

    
      $event.target.value = '';
      this.snackBar.open('Please select correct file format', '', {
        duration: 3000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.loading = false;
    } else {
      this.loading = true;
      var merchantid = localStorage.getItem('userId');
      this.url = window.location.origin;

      $event.target.files[0].userId = merchantid
      $event.target.files[0].url = this.url
  
      this.ProductService.addcsvfile($event.target.files[0]).subscribe(data => {

        if (data.string == "Csv import success fully")  {
          this.snackBar.open('CSV imported sucessfull', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          $event.target.value = '';  
          var userId = localStorage.getItem('userId');
          this.loading = false;


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
        } else if(data.string == "Pls add Primary till type"){
          this.snackBar.open('Pls add primary till type', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          var userId = localStorage.getItem('userId');
          this.loading = false;

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

          this.snackBar.open('please select correct csv file ', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.loading = false;
          $event.target.value = '';
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


  
  delete(id ) {

    
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
