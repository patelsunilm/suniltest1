import { Component, OnInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MAT_DIALOG_DATA, MatSnackBarVerticalPosition, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { tillManagementService } from '../../_services/index';



@Component({
  selector: 'app-tillmanagement',
  templateUrl: './tillmanagement.component.html',
  styleUrls: ['./tillmanagement.component.scss'],
  animations: fuseAnimations
})
export class TillmanagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'parentname', 'action'];
  dataSource;
  form: FormGroup;
  tilltype: any;
  tillDetails: any;
  showvalue : any;
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


  constructor(private tillManagementService: tillManagementService ,public dialog: MatDialog) { }



  ngOnInit() {

    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        data => {

          if (data == '' || data == null || data == 'null') {

          } else {
          this.tillDetails = data;
          const alltillmanagement = [];
          this.tillDetails.forEach(element => {

            element._id = element._id;
            element.name = element.name;
            element.type = "Primary"
            element.parentname= "-"
            element.flag = 1
            alltillmanagement.push(element);

          });


          if (alltillmanagement.length > 0) {
            this.dataSource = new MatTableDataSource(alltillmanagement);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;

          } else {
            this.isTableHasDataAgain = false;

          }
        }
        },
        error => {

          // console.log("error");

        });



    this.tillManagementService.getalltillType()
      .subscribe(
        data => {

          this.tilltype = data

        },
        error => {
          // console.log(error);

        });
  }



  selectTillType(value) {
    this.showvalue = value
   if(value == "Primary") {

    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        data => {

          if (data == '' || data == null || data == 'null') {

          } else {
          this.tillDetails = data;
          const alltillmanagement = [];
          this.tillDetails.forEach(element => {

            element._id = element._id;
            element.name = element.name;
            element.type = "Primary"
            element.parentname= "-"
            element.flag = 1
            alltillmanagement.push(element);

          });

          if (alltillmanagement.length > 0) {
            this.dataSource = new MatTableDataSource(alltillmanagement);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;

          } else {
            this.isTableHasDataAgain = false;

          }
        }
        },
        error => {

          // console.log("error");

        });
   } else if( value == "Secondary") {
 
    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        data => {
          if (data == '' || data == null || data == 'null') {

          } else {
          var parantname = data[0].name;
          this.tillDetails = data[0].secondary;
          const alltillmanagement = [];
          this.tillDetails.forEach(element => {

            element._id = element._id;
            element.name = element.name;
            element.type = "Secondary";
            element.parentname = parantname;
            element.flag = 2
            alltillmanagement.push(element);

          });

          if (alltillmanagement.length > 0) {
             
            this.dataSource = new MatTableDataSource(alltillmanagement);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;

          } else {
            this.isTableHasDataAgain = false;

          }
        }
        },
        error => {

          // console.log("error");

        });
   } else if(value == "Tertiary") {

    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        data => {

          if (data == '' || data == null || data == 'null') {

          } else {

          this.tillDetails = data[0].secondary;
          const alltillmanagement = [];
          var a = 0;
       
          this.tillDetails.forEach(element => {
               
              element.tertiary.forEach( (items , index) => {
              
                alltillmanagement.push({parentnameid :  element._id   ,parentname : element.name ,id: items._id,name : items.name ,type:"Tertiary",_id: items._id  ,flag : 3
              })
                a++;
              });

          });

          if (alltillmanagement.length > 0) {


            this.dataSource = new MatTableDataSource(alltillmanagement);
            this.dataSource.paginator = this.paginator;
            this.isTableHasDataAgain = true;

          } else {
            this.isTableHasDataAgain = false;

          }
        }
        },
        error => {

          // console.log("error");

        });
      
   }

  }

  deletetill(typeid , tillDetails) {
    var merchantId = localStorage.getItem('userId');
    tillDetails.merchantId = merchantId

    let dialogRef = this.dialog.open(deletetillmanagementpopupComponent, {
      data: {
         
        id : typeid,
        tillDetails : tillDetails

      },
      width: '450px'
  });
  dialogRef.afterClosed().subscribe(result => {
    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        data => {
         
          if(this.showvalue == "primary" || this.showvalue == undefined || this.showvalue == 'undefined' ) {

           
            this.tillDetails = data;
            const alltillmanagement = [];
            this.tillDetails.forEach(element => {
  
              element._id = element._id;
              element.name = element.name;
              element.type = "Primary"
              element.parentname= "-"
              element.flag = 1
              alltillmanagement.push(element);
  
            });
  
            if (alltillmanagement.length > 0) {
              this.dataSource = new MatTableDataSource(alltillmanagement);
              this.dataSource.paginator = this.paginator;
              this.isTableHasDataAgain = true;
  
            } else {
              this.isTableHasDataAgain = false;
  
            }
          } else if(this.showvalue == "Secondary") {
            var merchantId = localStorage.getItem('userId');
            this.tillManagementService.getTillManagementDetails(merchantId)
              .subscribe(
                data => {
                  if (data == '' || data == null || data == 'null') {
        
                  } else {
                  var parantname = data[0].name;
                  this.tillDetails = data[0].secondary;
                  const alltillmanagement = [];
                  this.tillDetails.forEach(element => {
        
                    element._id = element._id;
                    element.name = element.name;
                    element.type = "Secondary";
                    element.parentname = parantname;
                    element.flag = 2
                    alltillmanagement.push(element);
        
                  });
        
                  if (alltillmanagement.length > 0) {
                     
                    this.dataSource = new MatTableDataSource(alltillmanagement);
                    this.dataSource.paginator = this.paginator;
                    this.isTableHasDataAgain = true;
        
                  } else {
                    this.isTableHasDataAgain = false;
        
                  }
                }
                },
                error => {
        
                  // console.log("error");
        
                });
          } else if(this.showvalue == "Tertiary") {
            var merchantId = localStorage.getItem('userId');
            this.tillManagementService.getTillManagementDetails(merchantId)
              .subscribe(
                data => {
        
                  if (data == '' || data == null || data == 'null') {
        
                  } else {
        
                  this.tillDetails = data[0].secondary;
                  const alltillmanagement = [];
                  var a = 0;
               
                  this.tillDetails.forEach(element => {
                       
                      element.tertiary.forEach( (items , index) => {
                      
                        alltillmanagement.push({parentnameid :  element._id   ,parentname : element.name ,id: items._id,name : items.name ,type:"Tertiary",_id: items._id  ,flag : 3
                      })
                        a++;
                      });
        
                  });
        
                  if (alltillmanagement.length > 0) {
        
        
                    this.dataSource = new MatTableDataSource(alltillmanagement);
                    this.dataSource.paginator = this.paginator;
                    this.isTableHasDataAgain = true;
        
                  } else {
                    this.isTableHasDataAgain = false;
        
                  }
                }
                },
                error => {
        
                  // console.log("error");
        
                });
          }


        },
        error => {

          // console.log("error");

        });

  })
  }


}


@Component({
  selector: 'deletetillmanagement-popup',
  templateUrl: './deletetillmanagementpopup.html'
})
export class deletetillmanagementpopupComponent {
  returnUrl: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

      private route: ActivatedRoute,
      private router: Router,
      public snackBar: MatSnackBar,
      private  tillManagementService : tillManagementService
  ) {


  }
  ngOnInit() {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/merchant';
  }

  delete(tilldetails , id ) {
  
      this.tillManagementService.deletetilltypename(tilldetails ,id)
          .subscribe(
              data => {

                if(data.string == "Primary type is delete successfully.") {
                  this.snackBar.open('Primary type is delete successfully.', '', {
                      duration: 5000,
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                  });

                } else if(data.string == "Secondary type is delete successfully.") {
                  this.snackBar.open('Secondary type is delete successfully.', '', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
                } else if(data.string == "Tertiary type is delete successfully.") {
               
                  this.snackBar.open('Tertiary type is delete successfully.', '', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
                }
                  // this.snackBar.open('Merchant deleted successfully.', '', {
                  //     duration: 5000,
                  //     horizontalPosition: this.horizontalPosition,
                  //     verticalPosition: this.verticalPosition,
                  // });
                  // this.router.navigate([this.returnUrl]);

              },
              error => {
                  console.log(error);
              });
  }

}

export class DialogContentExampleDialog { }
