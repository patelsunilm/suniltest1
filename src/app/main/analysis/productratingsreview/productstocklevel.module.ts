import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductratingsreviewComponent } from './../productratingsreview/productratingsreview.component';
import { AuthGuardCommon } from '.././../../_guards/index';
import { AutofocusModule } from 'angular-autofocus-fix';

import { FusionChartsModule } from 'angular-fusioncharts';



// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load themes
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { NgxLoadingModule } from 'ngx-loading';


const routes = [
    {
        path: 'analysis/productratingsreview',
        component: ProductratingsreviewComponent,
        canActivate: [AuthGuardCommon]
    },
    

];

@NgModule({
    declarations: [
        ProductratingsreviewComponent,
        
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
        NgxLoadingModule
    ],
    exports: [
        ProductratingsreviewComponent,
       
    ]
})

export class ProductratingsreviewlModule {
}
