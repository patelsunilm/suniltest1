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
import { ForgotPassword2Module } from 'app/main/forgotpassword/forgot-password-2.module';
import { PasswordModule } from 'app/main/password/password.module';
import { ResetPasswordModule } from 'app/main/resetpassword/resetpassword.module';
import { MerchantModule } from 'app/main/merchant/merchant.module';
import { FaqModule } from 'app/main/faq/faq.module';
import { OrdersModule } from 'app/main/order/order.module';
import { GraphModule } from 'app/main/graph/graph.module';


import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { AuthGuard } from './_guards/index';
import { AuthGuardCommon } from './_guards/index';
import { AuthGuardCo } from './_guards/index';
import { JwtInterceptorProvider, ErrorInterceptorProvider } from './_helpers/index';

import { DashbordService } from './_services/index';
import { ForgotPasswordService } from './_services/index';
import { AuthenticationService } from './_services/index';
import { ProfileService } from './_services/index';
import { ChangePasswordService } from './_services/index';
import { ProductService } from './_services/index'
import { MerchantService } from './_services/index';
import { UsersService } from './_services/index';
import { tillManagementService } from './_services/index';


import { OrdersService } from './_services/index';
import { FAQService } from './_services/index';
import { GraphsService } from './_services/index';
import { NotificationService } from './_services/notification.service'

//all module
import { SignupModule } from './main/signup/signup.module';
import { ProductsModule } from './main/products/products.module';
import { from } from 'rxjs';
import { UsersModule } from 'app/main/users/users.module';
import { TillmanagementModule } from './main/tillmanagement/tillmanagement.module';
import { NotificationModule } from './main/notification/notification.module';


const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent,
       

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
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,

        Login2Module,
        DashboardModule,
        ProfileModule,
        SignupModule,
        ForgotPassword2Module,
        PasswordModule,
        ResetPasswordModule,
        MerchantModule,
        ProductsModule,
        FaqModule,
        UsersModule,
        TillmanagementModule,
        OrdersModule,
        GraphModule,
        NotificationModule,
       
    ], providers: [

        AuthGuard,
        AuthGuardCo,
        AuthGuardCommon,
        DashbordService,
        AuthenticationService,
        ProfileService,
        ChangePasswordService,
        ForgotPasswordService,
        MerchantService,
        OrdersService,
        FAQService,
        GraphsService,
        JwtInterceptorProvider,
        ErrorInterceptorProvider,
        ProductService,
        UsersService,
        tillManagementService,
        NotificationService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
