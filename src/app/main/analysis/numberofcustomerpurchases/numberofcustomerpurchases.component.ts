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
  form: FormGroup;
  Merchant: any;
  maxdate : any;
  dataSource : any;
  chartObj : any;
  showgraph : any;
  stackedColumnData: any;
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
      "data": [
        {
          "label": "Equity",
          "value": "300000",

        }, {
          "label": "Debt",
          "value": "230000",

        }, {
          "label": "Bullion",
          "value": "180000",

        }, {
          "label": "Real-estate",
          "value": "270000",

        }, {
          "label": "Insurance",
          "value": "20000",

        }
      ]
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
   
    this.OrdersService.getnumberofcustomerpurchases(this.form.value)
    .subscribe(
      data => {
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
      },
      error => {
        console.log(error);
      });

  }


  initialized($event) {

    this.chartObj = $event.chart; // saving chart instance
  }

  onSelectionChange() {

    this.OrdersService.getproductratingcounts(this.form.value)
    .subscribe(
      data => {


       var category = data.data.category;
       var dataSet = data.data.dataSet;
       this.showgraph = 1;

    
       this.stackedColumnData = {
        chart: {
          caption: "Number of customer purchases",
          // subCaption: " Top 5 Developed Countries",
           numbersuffix: "",
          showSum: "1",
          plotToolText:
            "$label product quantity",
          theme: "fusion"
        },
        categories: [
          {
               category
            
          }
        ],
            dataSet
          // dataSet: [
          //   {
          //     seriesName: "Coal",
          //     data: [
          //       {
          //         value: "400"
          //       },
          //       {
          //         value: "830"
          //       },
          //       {
          //         value: "500"
          //       },
          //       {
          //         value: "420"
          //       },
          //       {
          //         value: "790"
          //       },
          //       {
          //         value: "380"
          //       }
          //     ]
          //   },
          // ]
        }
       
      },
      error => {
        console.log(error);
      });
  }
}
