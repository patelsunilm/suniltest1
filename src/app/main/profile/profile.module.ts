import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatInputModule } from '@angular/material';
import { FuseHighlightModule } from '@fuse/components/index';
import { AgmCoreModule } from '@agm/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { ProfileComponent } from './profile.component';
import { AuthGuardCommon } from './../../_guards/index';
const routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardCommon]
    }
];

@NgModule({
    declarations: [
        ProfileComponent],
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
        FuseHighlightModule,
        FuseSidebarModule,
        FuseWidgetModule,
        ColorPickerModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        })

    ],
    exports: [
        ProfileComponent
    ]
})

export class ProfileModule {
}
