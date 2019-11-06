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

  config = {
    type: 'line',
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [{
        label: 'Chart 1',
        data: [2, 4, 8, 16],
      }, {
        label: 'Chart 2',
        data: [3, 4, 6, 9],
      }]
    },
    options: {
      spanGaps: true,
      responsive: true,
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Labels'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Values'
          },
          ticks: {
            min: 1,
            max: 10,
  
          }
        }]
      }
    }
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
 

          console.log('messge');
        } else {
          
          console.log('testtt');
       
          var start = this.form.value.startdate,
                end =this.form.value.endDate,
                currentDate = new Date(start),
                between = []
            ;
            while (currentDate <= end) {
                  currentDate.setDate(currentDate.getDate() + 1);
                  var datePipe = new DatePipe("en-US");
                  var newdate = datePipe.transform(currentDate, 'dd-MMM-yy');
                
                   between.push([newdate ,"quantity",0],[newdate,"value",0]);
                   //between.push(newdate);
                }
                
                
                this.showgraph = 0;
                var dataFetch = [];
                
                data.forEach(element => { 
                   var datePipe = new DatePipe("en-US");
                   var changedate = datePipe.transform(element._id.dayOfYear, 'dd-MMM-yy');
                   
                   

                   dataFetch.push([changedate,"quantity" ,element.totalQty] ,[changedate,"sellingPrice", element.value]);
                });
               
                console.log('data Fetch');
                console.log(dataFetch);
                console.log(between);
                return false
                between.forEach(elements => { 
                  
                  // if(dataFetch.includes(elements))
                  // {
                  //   console.log('swati');
                  // }
                  // else
                  //  {
                  //   console.log('test ');

                  //  }
                });

          var jsonify = res => res.json();
          // var dataFetch = fetch(
          //   'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/plotting-multiple-series-on-time-axis-data.json'
          // ).then(jsonify);
       
          // console.log('data Fetch 78'); 
          // console.log(dataFetch);
       
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
