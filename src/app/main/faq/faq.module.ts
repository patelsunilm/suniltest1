import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { AuthGuardCommon } from './../../_guards/index';

import { FaqComponent } from './faq.component';
import { FaqPopupComponent } from './faq.component';


const routes = [
    {
        path: 'faq',
        component: FaqComponent,
        canActivate: [AuthGuardCommon]
    },
    {
        path: 'faq',
        component: FaqPopupComponent,
        canActivate: [AuthGuardCommon]
    }

];

@NgModule({
    declarations: [
        FaqComponent,
        FaqPopupComponent
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
        MatExpansionModule
    ],
    exports: [
        FaqComponent,

    ],
    providers: [

    ]
})

export class FaqModule {
}
