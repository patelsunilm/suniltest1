import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTooltip } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-productstocklevel',
  templateUrl: './productstocklevel.component.html',
  styleUrls: ['./productstocklevel.component.scss'],
  animations: fuseAnimations
})
export class ProductstocklevelComponent implements OnInit {
  form: FormGroup;
  dataSource: Object;
  chartConfig: Object;

  constructor() {
    this.chartConfig = {
      width: '700',
      height: '400',
      type: 'column2d',
      
      dataFormat: 'json',
  };

  this.dataSource = {
      "chart": {
        "caption": "Countries With Most Oil Reserves [2017-18]",
        "subCaption": "In MMbbl = One Million barrels",
        "xAxisName": "Country",
        "yAxisName": "Reserves (MMbbl)",
        "numberSuffix": "K",
        "theme": "fusion",
      },
      "data": [{
        "label": "Venezuela",
        "value": "290"
      }, {
        "label": "Saudi",
        "value": "260"
      }, {
        "label": "Canada",
        "value": "180"
      }, {
        "label": "Iran",
        "value": "140"
      }, {
        "label": "Russia",
        "value": "115"
      }, {
        "label": "UAE",
        "value": "100"
      }, {
        "label": "US",
        "value": "30"
      }, {
        "label": "China",
        "value": "30"
      }]
    };
   }
  

  ngOnInit() {
 
  }

}
