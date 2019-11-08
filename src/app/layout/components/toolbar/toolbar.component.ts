import { Component, Input, Output, EventEmitter, SimpleChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';

import { ProfileService } from '../../../_services/index';

import { AuthenticationService } from '../../../_services/index';
import { NavigationEnd, NavigationStart, Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    name: string;
    myprofilelogoimage: string;
    usertype: string;
    returnUrl: string;
    navhide: any;
    master: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    mySubjectVal: any;
    @Input('myInputVal') myInputVal: string;
    @Output('myOutputVal') myOutputVal = new EventEmitter();
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    image : any;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private ProfileService: ProfileService
    ) {

        this.ProfileService.stringSubject.subscribe(
            data => {
                this.mySubjectVal = data;
                this.name = this.mySubjectVal.name;
                this.myprofilelogoimage = this.mySubjectVal.image
               
            })

           
      
        this.name = localStorage.getItem('name');
      
         this.image =  localStorage.getItem('myprofilelogoimage');
        // console.log('this images')
        // console.log(this.image)
        // if(this.image == undefined || this.image == "undefined") {
        //     this.image = "" 
        // } else {
        //     this.image == localStorage.getItem('myprofilelogoimage');
        // }
       
        this.myprofilelogoimage =this.image
      
       
        this.usertype = localStorage.getItem('userType');

        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */



    ngOnInit(): void {

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });

        this.navhide = localStorage.getItem('userType')


        this.ProfileService.stringSubject.subscribe(
            data => {
                this.mySubjectVal = data;
                this.name = this.mySubjectVal.name;
                this.myprofilelogoimage = this.mySubjectVal.image
               
            })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...

    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    logout() {

        this.authenticationService.logout();

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';

        this.router.navigate([this.returnUrl]);


    }
}
