import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { OrdersService } from '../../../_services/index';
import * as FusionCharts from 'fusioncharts';
@Pipe({
  name: 'dateFormatPipe',
})

@Component({
  selector: 'app-numberofcustomerpurchases',
  templateUrl: './numberofcustomerpurchases.component.html',
  styleUrls: ['./numberofcustomerpurchases.component.scss'],
  animations: fuseAnimations

})
export class NumberofcustomerpurchasesComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  form: FormGroup;
  Merchant: any;
  maxdate : any;
  dataSource : any;
  chartObj : any;
  showgraph : any;
  stackedColumnData: any;
  newsatrtdate : any;
  newendDate  : any;
  chart: any = 'stackedcolumn2d';


  constructor(private OrdersService : OrdersService ,public snackBar: MatSnackBar, private _formBuilder: FormBuilder) {

    this.dataSource = {
      "chart": {
        "caption": "Recommended Portfolio Split",
        "subCaption": "For a net-worth of $1M",
        "showValues": "1",
        "showPercentInTooltip": "0",
        "numberPrefix": "$",
        "enableMultiSlicing": "1",
        "theme": "fusion"
      },
     
    };
   }

  ngOnInit() {
  
    this.maxdate = new Date();
  
    this.form = this._formBuilder.group({
      startdate: ['', Validators.required],
      endDate: ['', Validators.required],

    });
  }

  getorderdetails() {

    this.Merchant = localStorage.getItem('userId');
    var start = this.form.value.startdate._d;
    var end = this.form.value.endDate._d;
    this.form.value.endDate = end;
    this.form.value.startdate = start;
    this.form.value.merchantid = this.Merchant;

    this.newsatrtdate = start;
    this.newendDate  = end
    this.OrdersService.getnumberofcustomerpurchases(this.form.value)
    .subscribe(
      data => {
        
       if(data == '' || data == undefined || data == "undefined" || data == null) {
        
        this.snackBar.open('No record found.', '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      
        } else {

        var ordercount = data.length;
        this.showgraph = "0";
        this.dataSource = {
          "chart": {
            "caption": "Number of customer Purchases",
            "showValues": "1",
            "showPercentInTooltip": "0",
            "numberPrefix": "",
            "enableMultiSlicing": "1",
            "theme": "fusion",

          },
          "data": [
            {
              "label": "order",
              "value": ordercount,
            },  
          ]
        }
      }
      },
      error => {
        console.log(error);
      });

  }


  initialized($event) {

    this.chartObj = $event.chart; // saving chart instance
  }

  onSelectionChange(chart) {
    
    if (chart == "stackedcolumn2d") { 

      this.Merchant = localStorage.getItem('userId');
      this.form.value.endDate = this.newendDate
      this.form.value.startdate = this.newsatrtdate
      this.form.value.merchantid = this.Merchant;
     
      this.OrdersService.getnumberofcustomerpurchases(this.form.value)
      .subscribe(
        data => {
          
         if(data == '' || data == undefined || data == "undefined" || data == null) {
          
          this.snackBar.open('No record found.', '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        
          } else {
  
          var ordercount = data.length;
          this.showgraph = "0";
          this.dataSource = {
            "chart": {
              "caption": "Number of customer Purchases",
              "showValues": "1",
              "showPercentInTooltip": "0",
              "numberPrefix": "",
              "enableMultiSlicing": "1",
              "theme": "fusion",
             
            },
            "data": [
              {
                "label": "order",
                "value": ordercount,
              },  
            ]
          }
         
        this.chart = chart;
        this.chartObj.chartType(chart);
        }
        },
        error => {
          console.log(error);
        });

      
    } else {

    
    this.OrdersService.getproductratingcounts(this.form.value)
    .subscribe(
      data => {
       var category = data.data.category;
       var dataSet = data.data.dataSet;        
       this.showgraph = 1;
       this.stackedColumnData = {
        chart: {
          caption: "Number of customer purchases",
        
           numbersuffix: "",
          showSum: "1",
          plotToolText:
            "$label product quantity <b>$dataValue</b>",
          theme: "fusion",
          opacity: 0

        },
        categories: [
          {
               category
            
          }
        ],
            dataSet
        }
      // this.dataSource1 = {
      //   "chart": {
      //     "caption": "Expense Analysis",
      //     "subCaption": "ACME Inc.",
      //     "xAxisname": "Region",
      //     "yAxisName": "Amount (In USD)",
      //     "numberPrefix": "$",
      //     "exportenabled": "1",
      //     "theme": "fusion"
      //   },
      //   "categories": [{
      //     category
      //   }],
      //   "dataset": [{
      //     "seriesName": "Actual Expenses",
      //     "data": [{
      //       "value": "1441290"
      //     }, {
      //       "value": "855912"
      //     }, {
      //       "value": "911404"
      //     }, {
      //       "value": "648136"
      //     }]
      //   }, {
      //     "seriesName": "Budgeted Expenses",
      //     "renderAs": "line",
      //     "data": [{
      //       "value": "1297430"
      //     }, {
      //       "value": "776485"
      //     }, {
      //       "value": "685352"
      //     }, {
      //       "value": "726791"
      //     }]
      //   }, {
      //     "seriesName": "Unknown liabilities",
      //     "renderAs": "area",
      //     "showAnchors" : "0",
      //     "data": [{
      //       "value": "143860"
      //     }, {
      //       "value": "79427"
      //     }, {
      //       "value": "226052"
      //     }, {
      //       "value": "78655"
      //     }]
      //   }]
      // };
        this.chart = chart;
        this.chartObj.chartType(chart);
      },
      error => {
        console.log(error);
      });
  }
}
}
