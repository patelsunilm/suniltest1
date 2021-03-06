import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    layout;
    navhide : any
    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    constructor(

        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        var custom = [
            {
                id: 'dashboard',
                title: 'Dashboard',
                url: '/dashboard',
                type: 'item',
                icon: 'dashboard'
            },
            {
                id: 'merchant',
                title: 'Merchants',
                url: '/merchant',
                type: 'item',
                icon: 'people'
            },
            {
                id: 'users',
                title: 'Users',
                url: '/users',
                type: 'item',
                icon: 'people'
            },
            {
                id: 'faq',
                title: 'Feedback',
                url: '/faq',
                type: 'item',
                icon: 'help'
            },
            // {
            //     id: 'order',
            //     title: 'Orders',
            //     url: '/order',
            //     type: 'item',
            //     icon: 'inbox'
            // },
            {
                id: 'notification',
                title: 'Notifications',
                url: '/notification',
                type: 'item',
                icon: 'notifications'
            },
          

        ]
        var custom2 = [
            {
                id: 'dashboard',
                title: 'Dashboard',
                url: '/dashboard',
                type: 'item',
                icon: 'dashboard'
            },
            {
                id: 'products',
                title: 'Products',
                url: '/products',
                type: 'item',
                icon: 'shopping_cart'
            },
            {

                id: 'tillmanagement',
                title: 'Till Management',
                url: '/tillmanagement',
                type: 'item',
                icon: 'shopping_cart'
            },

            {
                id: 'faq',
                title: 'Feedback',
                url: '/faq',
                type: 'item',
                icon: 'help'
            },
            {
                id: 'order',
                title: 'Orders',
                url: '/order',
                type: 'item',
                icon: 'inbox'
            },
            {
                id: 'diary',
                title: 'Diary',
                url: '/diary',
                type: 'item',
                icon: 'today'
            },
            {
                id: 'analysis',
                title: 'Analysis',
                type: 'collapsable',
                icon: 'timeline',
                children: [
                    {
                        id: 'productsalescomparison',
                        title: 'Product sales comparison',
                        url: '/analysis/productsalescomparison',
                        type: 'item',
                        
                    },
                    // {
                    //     id: 'productstocklevel',
                    //     title: 'Product stock level',
                    //     url: '/analysis/productstocklevel',
                    //     type: 'item',
                      
                    // },
                    {
                        id: 'productratingsreview',
                        title: 'Product ratings review',
                        url: '/analysis/productratingsreview',
                        type: 'item',
                       
                    },
                    {
                        id: 'numberofcustomerpurchases',
                        title: 'Number of customer purchases',
                        url: '/analysis/numberofcustomerpurchases',
                        type: 'item',
                       
                    },
                    {
                        id: 'valueofcustomerpurchases',
                        title: 'Value of customer purchases',
                        url: '/analysis/valueofcustomerpurchases',
                        type: 'item',
                       
                    },
                    // {
                    //     id: 'customerratingsperproduct',
                    //     title: 'Customer ratings per product',
                    //     url: '/analysis/customerratingsperproduct',
                    //     type: 'item',
                    // },
                    {
                        id: 'tillsalesperproduct',
                        title: 'Till sales per product',
                        url: '/analysis/tillsalesperproduct',
                        type: 'item',
                        
                    },
                ]
            }, 
            {
                id: 'chat',
                title: 'Chats',
                url: '/chat',
                type: 'item',
                icon: 'chat'
            },
            
        ]
        _router.events.subscribe(
            (event) => {

                if (event instanceof NavigationEnd) {
                    var custom = [
                        {
                            id: 'dashboard',
                            title: 'Dashboard',
                            url: '/dashboard',
                            type: 'item',
                            icon: 'dashboard'
                        },
                        {
                            id: 'merchant',
                            title: 'Merchants',
                            url: '/merchant',
                            type: 'item',
                            icon: 'people'
                        },
                        {
                            id: 'users',
                            title: 'Users',
                            url: '/users',
                            type: 'item',
                            icon: 'people'
                        },
                        {
                            id: 'faq',
                            title: 'Feedback',
                            url: '/faq',
                            type: 'item',
                            icon: 'help'
                        },
                        // {
                        //     id: 'order',
                        //     title: 'Orders',
                        //     url: '/order',
                        //     type: 'item',
                        //     icon: 'inbox'
                        // },
                        {
                            id: 'notification',
                            title: 'Notifications',
                            url: '/notification',
                            type: 'item',
                            icon: 'notifications'
                        },
                        
                    ]
                    var custom2 = [
                        {
                            id: 'dashboard',
                            title: 'Dashboard',
                            url: '/dashboard',
                            type: 'item',
                            icon: 'dashboard'
                        },

                        {
                            id: 'products',
                            title: 'Products',
                            url: '/products',
                            type: 'item',
                            icon: 'shopping_cart'
                        },
                        
                        {

                            id: 'tillmanagement',
                            title: 'Till Management',
                            url: '/tillmanagement',
                            type: 'item',
                            icon: 'shopping_cart'
                        },

                        {
                            id: 'faq',
                            title: 'Feedback',
                            url: '/faq',
                            type: 'item',
                            icon: 'help'
                        },
                        {
                            id: 'order',
                            title: 'Orders',
                            url: '/order',
                            type: 'item',
                            icon: 'inbox'
                        },
                        {
                            id: 'diary',
                            title: 'Diary',
                            url: '/diary',
                            type: 'item',
                            icon: 'today'
                        },

                        {
                            id: 'analysis',
                            title: 'Analysis',
                            type: 'collapsable',
                            icon: 'timeline',
                            children: [
                                {
                                    id: 'productsalescomparison',
                                    title: 'Product sales comparison',
                                    url: '/analysis/productsalescomparison',
                                    type: 'item',
                                    
                                },
                                // {
                                //     id: 'productstocklevel',
                                //     title: 'Product stock level',
                                //     url: '/analysis/productstocklevel',
                                //     type: 'item',
                                  
                                // },
                                {
                                    id: 'productratingsreview',
                                    title: 'Product ratings review',
                                    url: '/analysis/productratingsreview',
                                    type: 'item',
                                   
                                },
                                {
                                    id: 'numberofcustomerpurchases',
                                    title: 'Number of customer purchases',
                                    url: '/analysis/numberofcustomerpurchases',
                                    type: 'item',
                                   
                                },
                                {
                                    id: 'valueofcustomerpurchases',
                                    title: 'Value of customer purchases',
                                    url: '/analysis/valueofcustomerpurchases',
                                    type: 'item',
                                   
                                },
                                // {
                                //     id: 'customerratingsperproduct',
                                //     title: 'Customer ratings per product',
                                //     url: '/analysis/customerratingsperproduct',
                                //     type: 'item',
                                 
                                // },
                                {
                                    id: 'tillsalesperproduct',
                                    title: 'Till sales per product',
                                    url: '/analysis/tillsalesperproduct',
                                    type: 'item',
                                    
                                },
                               
                            ]
                        },
                        {
                            id: 'chat',
                            title: 'Chats',
                            url: '/chat',
                            type: 'item',
                            icon: 'chat'
                        },
                    ];

                    if (localStorage.getItem('userType') == 'admin') {
                        this.navigation = custom;
                    } else if (localStorage.getItem('userType') == 'Merchant') {
                        this.navigation = custom2;
                    }
                }
            })


        if (localStorage.getItem('userType') == 'admin') {
            this.navigation = custom;
        } else if (localStorage.getItem('userType') == 'Merchant') {
            this.navigation = custom2;
        }

        // this.navigation = custom;
        // this.navigation = custom2;

        this.layout = 'vertical';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective)
    set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._fusePerfectScrollbar.update();
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    const activeNavItem: any = document.querySelector('navbar .nav-link.active');

                    if (activeNavItem) {
                        const activeItemOffsetTop = activeNavItem.offsetTop,
                            activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                            scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

                        this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                    }
                });
            }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    

    ngOnInit(): void {

        this.toggleSidebarOpened('navbar');

        // this._router.events
        //     .pipe(
        //         filter((event) => event instanceof NavigationEnd),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe(() => {
        //             if ( this._fuseSidebarService.getSidebar('navbar') )
        //             {
        //                 this._fuseSidebarService.getSidebar('navbar').close();
        //             }
        //         }
        //     );

        //   Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        //  Get current navigation
        // this._fuseNavigationService.onNavigationChanged
        //     .pipe(
        //         filter(value => value !== null),
        //         takeUntil(this._unsubscribeAll)
        //     )
        //     .subscribe(() => {
        //         this.navigation = this._fuseNavigationService.getCurrentNavigation();

        //     });

    
    if(localStorage.getItem('userType') == null || localStorage.getItem('userType') == "null" || localStorage.getItem('userType') == undefined || localStorage.getItem('userType') == "undefined") {
       
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };


    }
        
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
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(key): void {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }
}
