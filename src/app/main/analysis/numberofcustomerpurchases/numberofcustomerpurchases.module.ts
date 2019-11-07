import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NumberofcustomerpurchasesComponent } from './../numberofcustomerpurchases/numberofcustomerpurchases.component';
import { AuthGuardCo } from '.././../../_guards/index';
import { AutofocusModule } from 'angular-autofocus-fix';

import { FusionChartsModule } from 'angular-fusioncharts';



import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load fusion theme
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);


import { NgxLoadingModule } from 'ngx-loading';
import { MatDatepickerModule } from '@angular/material/datepicker';


const routes = [
    {
        path: 'analysis/numberofcustomerpurchases',
        component: NumberofcustomerpurchasesComponent,
        canActivate: [AuthGuardCo]
    },
    

];

@NgModule({
    declarations: [
        NumberofcustomerpurchasesComponent,
        
    ],
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
        AutofocusModule,
        FusionChartsModule,
        NgxLoadingModule,MatDatepickerModule
    ],
    exports: [
        NumberofcustomerpurchasesComponent,
       
    ]
})

export class NumberofcustomerpurchasesModule {
}
