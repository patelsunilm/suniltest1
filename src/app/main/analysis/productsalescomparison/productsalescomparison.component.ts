import { Component, OnInit, NgZone, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { tillManagementService } from '../../../_services/index';
import { GraphsService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';

import { OrdersService } from '../../../_services/index';

import * as shape from 'd3-shape';
import * as FusionCharts from 'fusioncharts';

@Pipe({
  name: 'dateFormatPipe',
})


@Component({
  selector: 'app-productsalescomparison',
  templateUrl: './productsalescomparison.component.html',
  styleUrls: ['./productsalescomparison.component.scss'],
  animations: fuseAnimations
})

export class ProductsalescomparisonComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  pro: any;
  showgraph : any;
  form: FormGroup;
  product: any;
  primary: any;
  secondary: any;
  tertiary: any;
  widgets: any;
  projects: any[];
  selectedProject: any;
  productnamesetgraph : any;

  dateNow = Date.now();

  dataSource: any;
  type: string;
  width: string;
  height: string;
  //test
  // minDate = moment(new Date()).format('YYYY-MM-DD')
  constructor( public snackBar: MatSnackBar,private OrdersService: OrdersService, private GraphsService: GraphsService, private _formBuilder: FormBuilder, private tillManagementService: tillManagementService) {

    this.type = 'timeseries';
    this.width = '100%';
    this.height = '400';
    // This is the dataSource of the chart
    this.dataSource = {
      // Initially data is set as null
      data: null,
      caption: {
        text: 'Product Sales Comparison'
      },
      chart: {
        showLegend: 0
      },
      subcaption: {
        text:  this.productnamesetgraph
      },
      yAxis: [
        {
          plot: {
            value: 'Grocery Sales Value',
            type: 'column',
          
          },
          format: {
            prefix: ''
          },
          title: 'Sale Value'
        }
      ]
    };
    this.fetchData();
  }

  ngOnInit() {

    this.form = this._formBuilder.group({
      tilltype: ['', Validators.required],
      startdate: ['', Validators.required],
      endDate: ['', Validators.required],
      productname: ['', Validators.required]
    });

    var merchantId = localStorage.getItem('userId');
    this.tillManagementService.getTillManagementDetails(merchantId)
      .subscribe(
        
        data => {

          if (data == '' || data == null || data == 'null') {

          } else {
            this.primary = data;
            this.secondary = data[0].secondary;

            var tertiarydata = []
            this.secondary.forEach(element => {

              element.tertiary.forEach(items => {

                tertiarydata.push(items);
              });
            });
            this.tertiary = tertiarydata;
          }

        })

    this.widgets = this.GraphsService.widgets;
    this.projects = this.GraphsService.projects;

  }

  getorderdetails() {

    if (this.form.value.tilltype == undefined || this.form.value == "undefined" || this.form.value == '') {

      // this.snackBar.open('Product added successfully.', '', {
      //   duration: 3000,
      //   horizontalPosition: this.horizontalPosition,
      //   verticalPosition: this.verticalPosition,
      // });

    } else {

      var valuesplit = this.form.value.productname.split(',');
      var start = this.form.value.startdate._d
      var end = this.form.value.endDate._d
      this.form.value.endDate = end
      this.form.value.startdate = start
      this.form.value.productname = valuesplit[0];
      this.pro = this.form.value.productname
      this.productnamesetgraph = valuesplit[1];
      this.OrdersService.getProductsbydate(this.form.value).subscribe(data => {

      if(data == '' || data == undefined || data == "undefined") {

      } else {
        var arr = [];
        for (var i = 0; i < data.length; i++) {

          var datePipe = new DatePipe("en-US");
          var changedate = datePipe.transform(data[i]._id, 'dd-MMM-yy');

          arr.push([changedate, data[i].Qty]);
        }

        var jsonify = res => res.json();
        var schemaFetch = fetch(
          'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json'
        ).then(jsonify);

        Promise.all([arr, schemaFetch]).then(res => {
          const data = arr;
          const schema = res[1];
          const fusionDataStore = new FusionCharts.DataStore();
          const fusionTable = fusionDataStore.createDataTable(data, schema);   
          this.dataSource.data = fusionTable;
        });
        this.showgraph = "0";
      }
      })
    }
  }

  onSelectionChanged(event) {

    if (event.value == undefined || event.value == 'undefined') {

    } else {
      this.OrdersService.getProductsbyid(event.value).subscribe(data => {
        this.product = data;
      },
        error => {

          console.log("error");


        })
    }
  }


  fetchData() {


    // var jsonify = res => res.json();
    // var dataFetch = fetch(
    //   'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/line-chart-with-time-axis-data.json'
    // ).then(jsonify);
    // var schemaFetch = fetch(
    //   'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json'
    // ).then(jsonify);

    // Promise.all([dataFetch, schemaFetch]).then(res => {
    //   const data = res[0];
    //   const schema = res[1];
    //   const fusionDataStore = new FusionCharts.DataStore();
    //   const fusionTable = fusionDataStore.createDataTable(data, schema);
    //   this.dataSource.data = fusionTable;
    // });
  }
}
