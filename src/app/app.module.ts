import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { Login2Module } from 'app/main/login/login.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { ProfileModule } from 'app/main/profile/profile.module';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { AuthGuard } from './_guards/index';
import { AuthGuardCommon } from './_guards/index';
import { AuthGuardCo } from './_guards/index';
import { JwtInterceptorProvider, ErrorInterceptorProvider } from './_helpers/index';

import { AuthenticationService } from './_services/index';
import { ProfileService } from './_services/index';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true, onSameUrlNavigation: 'reload' }),

        TranslateModule.forRoot(),
        MatMomentDateModule,
        MatButtonModule,
        MatIconModule,
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        // App modules
        LayoutModule,

        Login2Module,
        DashboardModule,
        ProfileModule

    ], providers: [
        //  AuthGuard,
        AuthGuard,
        AuthGuardCo,
        AuthGuardCommon,
        AuthenticationService,
        ProfileService,
        JwtInterceptorProvider,
        ErrorInterceptorProvider,

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
