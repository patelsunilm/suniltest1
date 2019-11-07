import { Component, OnInit, NgZone } from '@angular/core';
import { ViewChild, TemplateRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ProductService } from '../../../_services/index';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-productratingsreview',
  templateUrl: './productratingsreview.component.html',
  styleUrls: ['./productratingsreview.component.scss'],
  animations: fuseAnimations
})
export class ProductratingsreviewComponent implements OnInit {
  dataSource: any;
  chartObj: any;
  chart: any = 'column2d';
  Merchant: any;
  productvalue: any;
  ratingdetils: any;
  productid: any;
  hidediv: any;
  form: FormGroup;
  @ViewChild('parent') parent;
  @ViewChild('mySelect') mySelect;
  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate: TemplateRef<any>;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour, tertiaryColour: this.primaryColour, backdropBorderRadius: '3px' };

  // Private
  private _unsubscribeAll: Subject<any>;

  public toggleColours(parent): void {
    this.coloursEnabled = !this.coloursEnabled;

    if (this.coloursEnabled) {
      this.primaryColour = PrimaryRed;
      this.secondaryColour = SecondaryBlue;
    } else {
      this.primaryColour = PrimaryWhite;
      this.secondaryColour = SecondaryGrey;
    }

  }



  constructor(private zone: NgZone, private ProductService: ProductService ,private _formBuilder: FormBuilder) {
    
    this.Merchant = localStorage.getItem('userId');
    this.ProductService.getProductsRatingDetails(this.Merchant)
      .subscribe(
        data => {
          if (data == '' || data == undefined || data == 'undefined' || data == null) {

            this.hidediv = "false"

          } else {

            this.ratingdetils = data;
            data = [];

            this.ratingdetils.forEach(element => {

              element.label = element.productname;
              element.value = element.qty.toString();
              element.id = element._id;

              data.push(element);
            });

            this.dataSource = {
              "chart": {
                "caption": "Product Rating review",
                "showValues": "1",
                "showPercentInTooltip": "0",
                "numberPrefix": "",
                "enableMultiSlicing": "1",
                "theme": "fusion",

              },
              data
            }
          }
        }, error => {
          console.log(error);
        });   
        // this.dataSource = {
        //   "chart": {
        //     "caption": "Product Rating review",
        //     "showValues": "1",
        //     "showPercentInTooltip": "0",
        //     "numberPrefix": "",
        //     "enableMultiSlicing": "1",
        //     "theme": "fusion",

        //   },
          
        // }   
  }

 


  ngOnInit() {

    this.form = new FormGroup({
     
    });
    
    this.Merchant = localStorage.getItem('userId');
    this.ProductService.getProductsRatingDetails(this.Merchant)
      .subscribe(
        data => {

          if (data == '' || data == undefined || data == 'undefined' || data == null) {

            console.log('testing aaa');
            this.hidediv = "false"

          } else {

            this.ratingdetils = data;
            data = [];

            this.ratingdetils.forEach(element => {

              element.label = element.productname;
              element.value = element.qty.toString();
              element.id = element._id;

              data.push(element);
            });


            this.dataSource = {
              "chart": {
                "caption": "Product Rating review",
                "showValues": "1",
                "showPercentInTooltip": "0",
                "numberPrefix": "",
                "enableMultiSlicing": "1",
                "theme": "fusion",

              },
              data
            }
          }
        }, error => {
          console.log(error);
        });

  }
  initialized($event) {

    this.chartObj = $event.chart; // saving chart instance
  }


  onSelectionChange(chart, cart, $event) {

    if (chart == "column2d") {
      this.Merchant = localStorage.getItem('userId');
      this.ProductService.getProductsRatingDetails(this.Merchant)
        .subscribe(
          data => {
            this.ratingdetils = data;
            data = [];

            this.ratingdetils.forEach(element => {
              element.label = element.productname;
              element.value = element.qty.toString();
              element.id = element._id;
              data.push(element);
            });

            this.dataSource = {
              "chart": {
                "caption": "Product Rating review",
                "showValues": "1",
                "showPercentInTooltip": "0",
                "numberPrefix": "",
                "enableMultiSlicing": "1",
                "theme": "fusion",

              },
              data
            }
            this.chart = chart;
            this.chartObj.chartType(chart);
          });

    } else {

      var pro = this.productvalue.split(',');
      this.ratingdetils.forEach(element => {
        if (element.productname == pro[0] && element.qty == pro[1]) {

          this.productid = element._id
        }
      });
      this.ProductService.getProductsRatingDetailsbyid(this.productid)
        .subscribe(
          data => {
            var ratingdetils = data;
            data = [];
            ratingdetils.forEach(element => {
             
              var firstname;
              if(element.username == '' || element.username == undefined || element.username == "undefined") {
                firstname = "";
              } else {
               
                firstname = element.username[0].firstname
              }
              element.label = firstname;
              element.value = element.ratings.rating.toString();
              data.push(element);
            });
            this.dataSource = {
              "chart": {
                "caption": "Product Rating review",
                "showValues": "1",
                "showPercentInTooltip": "0",
                "numberPrefix": "",
                "enableMultiSlicing": "1",
                "theme": "fusion",

              },
              data
            }
            this.chart = chart;
            this.chartObj.chartType(chart); // Changing chart type using chart instance
          }, error => {
            console.log(error);
          });

    }
  }

  update($event) {
    this.productvalue = $event.dataObj.toolText
  }

}
