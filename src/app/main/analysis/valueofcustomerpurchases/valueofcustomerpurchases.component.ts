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

  //  fetchData() {
  //   var jsonify = res => res.json();
  //   var dataFetch = fetch(
  //     'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/plotting-multiple-series-on-time-axis-data.json'
  //   ).then(jsonify);
  //   var schemaFetch = fetch(
  //     'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/plotting-multiple-series-on-time-axis-schema.json'
  //   ).then(jsonify);

  //   Promise.all([dataFetch, schemaFetch]).then(res => {
  //     const data = res[0];
  //     const schema = res[1];

  //     // console.log('dara 123');
  //     // console.log(data);
  //     // First we are creating a DataStore
  //     const fusionDataStore = new FusionCharts.DataStore();
  //     // After that we are creating a DataTable by passing our data and schema as arguments
  //     const fusionTable = fusionDataStore.createDataTable(data, schema);
  //     // Afet that we simply mutated our timeseries datasource by attaching the above
  //     // DataTable into its data property.
  //     this.dataSource.data = fusionTable;
  //   });
  // }
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
          this.allappusers = data;
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
                
                 //  between.push([newdate ,"quantity",0],[newdate,"value",0]);
                   between.push(newdate);
                }
               
                
                var e = [];
                for (let i = 0; i < between.length; i++) {
                  const element = between[i];
                  
                     for (let j = 0; j < data.length; j++) {
                       const element = data[j];
                     
                       var changedate = datePipe.transform( data[j]._id.dayOfYear, 'dd-MMM-yy');
                      
                       if(between[i] === changedate) {
                          
                        console.log('t')
                         
                          e.push([between[i],"quantity" ,data[j].totalQty]);

                          // [between[i],"value" ,data[j].value]
                        } else {
                          // console.log('s')
                          // console.log(between[i]);
                          //  e.push([between[i],"quantity" ,0]);
                          // [between[i],"value" ,0]
                        } 
                         
                     }
                     e.push([between[i],"quantity" ,0]);
                }
                console.log('e')
                console.log(e);


               
                this.showgraph = 0;
                var dataFetch = [];
                data.forEach(element => { 
                   var datePipe = new DatePipe("en-US");
                   var changedate = datePipe.transform(element._id.dayOfYear, 'dd-MMM-yy');
                   dataFetch.push([changedate,"quantity" ,element.totalQty] ,[changedate,"sellingPrice", element.value]);

                });
                // console.log('data Fetch beteens');
                // console.log(dataFetch);
                //  console.log(between)

                
                // for (let i = 0; i < between.length; i++) {
                 
                  
                //   for (let j = 0; j < dataFetch.length; j++) {
                //          console.log('ss');
                //          console.log(between[i]);
                //          console.log(dataFetch[j]);
                     
                //     // if(a[i].)
                //   }
                  
                // }
          

        //  this.showgraph = 0;
        //   var dataFetch = [];
        //   data.forEach(element => { 
        //     var datePipe = new DatePipe("en-US");
        //     var changedate = datePipe.transform(element._id.dayOfYear, 'dd-MMM-yy');
        //     dataFetch.push([changedate,"quantity" ,element.totalQty] ,[changedate,"sellingPrice", element.value]);
        //   });
            
      
          var jsonify = res => res.json();
          // var dataFetch = fetch(
          //   'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/plotting-multiple-series-on-time-axis-data.json'
          // ).then(jsonify);
          var schemaFetch = fetch(
            'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/plotting-multiple-series-on-time-axis-schema.json'
          ).then(jsonify);
      
          Promise.all([dataFetch, schemaFetch]).then(res => {
            const data = res[0];
            const schema = res[1];
           
            console.log('schemsFetch');
            console.log(schemaFetch);
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
