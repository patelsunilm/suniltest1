import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { OrdersService } from '../../../_services/index';
import { UsersService } from '../../../_services/index';
import * as FusionCharts from 'fusioncharts';
import { formatDate } from "@angular/common";
import * as $ from 'jquery';

@Pipe({
  name: 'dateFormatPipe',
})
@Component({
  selector: 'app-valueofcustomerpurchases',
  templateUrl: './valueofcustomerpurchases.component.html',
  styleUrls: ['./valueofcustomerpurchases.component.scss'],
  animations: fuseAnimations
})

export class ValueofcustomerpurchasesComponent implements OnInit {
  form: FormGroup;
  showgraph : any;
  maxdate : any;
  Merchant : any;
  allappusers : any;
  dataSource: any;
  type: string;
  width: string;
  height: string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

 
  constructor( private UsersService : UsersService,private OrdersService : OrdersService,public snackBar: MatSnackBar, private _formBuilder: FormBuilder) {
    this.type = 'timeseries';
    this.width = '100%';
    this.height = '400'
    this.dataSource = {
      // Initially data is set as null
      data: null,
      caption: {
        text: 'Sales Analysis'
      },
      subcaption: {
        text: 'Grocery & Footwear'
      },
      series: 'Type',
      yAxis: [
        {
          plot: {
            value: 'Grocery Sales Value',
            type: 'line'
          },
          title: 'Sale Value',
          format: {
            prefix: ''
          }
        }
      ]
    };
    // this.fetchData();
   }

  
  ngOnInit() {
    this.maxdate = new Date();
  
    this.form = this._formBuilder.group({
      startdate: ['', Validators.required],
      endDate: ['', Validators.required],
      username : ['', Validators.required]

    });


    this.UsersService.GetallUsersDetails()
      .subscribe(
        data => {
          var user = data
          const allusers = [];
          user.forEach(element => {
            
          
            if (element.firstname == '' || element.firstname == undefined || element.firstname == 'undefined') {

            } else {
              allusers.push(element);
            }
          });

          // this.users = allusers;
          this.allappusers = allusers;

        },
        error => {
          console.log(error);
        });
  }

  
  getcustomervalue() {


    this.Merchant = localStorage.getItem('userId');
    var start = this.form.value.startdate._d;
    var end = this.form.value.endDate._d;
    this.form.value.endDate = end;
    this.form.value.startdate = start;
    this.form.value.merchantid = this.Merchant;
    this.OrdersService.getvalueofcustomerpurchases(this.form.value)
    .subscribe(
      data => {
        if(data == '' || data == undefined || data == "undefined" || data == null) {
 
          this.snackBar.open('No record found.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
      
        } else {
          
          var start = this.form.value.startdate,
                end =this.form.value.endDate,
                currentDate = new Date(start),
                between = []
            ;
            while (currentDate <= end) {
                  currentDate.setDate(currentDate.getDate() + 1);
                  var datePipe = new DatePipe("en-US");
                  var newdate = datePipe.transform(currentDate, 'dd-MMM-yy');
                
                   //between.push([newdate ,"quantity",0],[newdate,"value",0]);
                   between.push(newdate);
                }
                
                
                this.showgraph = 0;
                var dataFetch = [];
                
                data.forEach(element => { 
                   var datePipe = new DatePipe("en-US");
                   var changedate = datePipe.transform(element._id.dayOfYear, 'dd-MMM-yy');
                   dataFetch.push([changedate,"quantity" ,element.totalQty] ,[changedate,"sellingPrice", element.value]);
                });
               
               console.log('bettweens');
               console.log(between);
               console.log(dataFetch)

               var dataFetchNew = [];

               dataFetch.forEach(element => { 
                 console.log('array');
                 console.log(element[0]);
                dataFetchNew[element[0]][0] =element[0];
             });

                // for(let k=0; k<dataFetch.length;k++)
                // {
                //   dataFetchNew[dataFetch[k]][0] = dataFetch[k];
                // }

                console.log('dataFetchNew');
                console.log(dataFetchNew)

          return false      
          var jsonify = res => res.json();
          
          var schemaFetch = fetch(
            'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/plotting-multiple-series-on-time-axis-schema.json'
          ).then(jsonify);
          
          
          Promise.all([dataFetch, schemaFetch]).then(res => {
            const data = res[0];
            const schema = res[1];
            const fusionDataStore = new FusionCharts.DataStore();
            const fusionTable = fusionDataStore.createDataTable(data, schema);
            this.dataSource.data = fusionTable;
          });


        }
      },
      error => {
        console.log(error);
      });
  }
}
