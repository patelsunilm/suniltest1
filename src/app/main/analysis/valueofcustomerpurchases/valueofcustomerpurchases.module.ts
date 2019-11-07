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

import { ValueofcustomerpurchasesComponent } from './valueofcustomerpurchases.component';
import { ChartsModule } from 'ng2-charts';

import { AuthGuardCo } from '.././../../_guards/index';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';


import { FusionChartsModule } from 'angular-fusioncharts'
// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load themes
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionChartsModule.fcRoot(
    FusionCharts,
    Charts,
    FusionTheme
  )
const routes = [
    {
        path: 'analysis/valueofcustomerpurchases',
        component: ValueofcustomerpurchasesComponent,
        canActivate: [AuthGuardCo]
    }
];

@NgModule({
    declarations: [
        ValueofcustomerpurchasesComponent],
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
        ValueofcustomerpurchasesComponent
    ]
})

export class  ValueofcustomerpurchasesModule {
}
