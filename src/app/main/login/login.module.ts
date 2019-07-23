import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { Login2Component } from 'app/main/login/login.component';
import { secretvaluepopupComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

let config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("96995962899-ham8fkomm5euscplet6fh6ko3ovgje6k.apps.googleusercontent.com")
    },
  ]);
  

  export function provideConfig() {
    return config;
  }

const routes = [
    {
        path: 'login',
        component: Login2Component
    },
    {
        path: 'login',
        component: secretvaluepopupComponent,
    }
];

@NgModule({
    declarations: [
        Login2Component,
        secretvaluepopupComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        FuseSharedModule,
        MatDialogModule, HttpClientModule, BrowserModule,
        SocialLoginModule
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ]
})
export class Login2Module {
}
