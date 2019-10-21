import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseHighlightModule } from '@fuse/components/index';

import { ProductsalescomparisonComponent } from './productsalescomparison.component';

import { AuthGuardCommon } from '.././../../_guards/index';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FusionChartsModule } from 'angular-fusioncharts';


import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load themes
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(
    FusionCharts,
    Charts,
    FusionTheme,TimeSeries
  )
const routes = [
    {
        path: 'analysis/productsalescomparison',
        component: ProductsalescomparisonComponent,
        canActivate: [AuthGuardCommon]
    }
];

@NgModule({
    declarations: [
        ProductsalescomparisonComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatInputModule,
        NgxChartsModule,
        MatPaginatorModule,
        MatDialogModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseWidgetModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        FuseHighlightModule,
        MatDatepickerModule,
        FusionChartsModule,FusionChartsModule
    ],
    exports: [
        ProductsalescomparisonComponent
    ]
})

export class ProductsalescomparisonModule {
}
