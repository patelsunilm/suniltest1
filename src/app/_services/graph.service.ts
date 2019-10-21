import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class GraphsService implements Resolve<any>
{
   
    widgets =  {
        'widget5'      : {
            'title'     : 'Product salescomparis',
            'ranges'    : {
                'TW': 'This Week',
                'LW': 'Last Week',
                '2W': '2 Weeks Ago'
            },
            'mainChart' : {
                '2W': [
                    {
                        'name'  : 'Mon',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 37
                            },
                           
                        ]
                    
                  
                    },
                    
                ],
                'LW': [
                    {
                        'name'  : 'Mon',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 37
                            },
                            {
                                'name' : 'closed issues',
                                'value': 12
                            }
                        ]
                    },
                    {
                        'name'  : 'Tue',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 24
                            },
                            {
                                'name' : 'closed issues',
                                'value': 8
                            }
                        ]
                    },
                    {
                        'name'  : 'Wed',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 51
                            },
                            {
                                'name' : 'closed issues',
                                'value': 7
                            }
                        ]
                    },
                    {
                        'name'  : 'Thu',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 31
                            },
                            {
                                'name' : 'closed issues',
                                'value': 13
                            }
                        ]
                    },
                    {
                        'name'  : 'Fri',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 29
                            },
                            {
                                'name' : 'closed issues',
                                'value': 7
                            }
                        ]
                    },
                    {
                        'name'  : 'Sat',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 17
                            },
                            {
                                'name' : 'closed issues',
                                'value': 6
                            }
                        ]
                    },
                    {
                        'name'  : 'Sun',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 31
                            },
                            {
                                'name' : 'closed issues',
                                'value': 10
                            }
                        ]
                    }
                ],
                'TW': [
                    {
                        'name'  : 'Mon',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 42
                            },
                            {
                                'name' : 'closed issues',
                                'value': 11
                            }
                        ]
                    },
                    {
                        'name'  : 'Tue',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 28
                            },
                            {
                                'name' : 'closed issues',
                                'value': 10
                            }
                        ]
                    },
                    {
                        'name'  : 'Wed',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 43
                            },
                            {
                                'name' : 'closed issues',
                                'value': 8
                            }
                        ]
                    },
                    {
                        'name'  : 'Thu',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 34
                            },
                            {
                                'name' : 'closed issues',
                                'value': 11
                            }
                        ]
                    },
                    {
                        'name'  : 'Fri',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 20
                            },
                            {
                                'name' : 'closed issues',
                                'value': 8
                            }
                        ]
                    },
                    {
                        'name'  : 'Sat',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 25
                            },
                            {
                                'name' : 'closed issues',
                                'value': 10
                            }
                        ]
                    },
                    {
                        'name'  : 'Sun',
                        'series': [
                            {
                                'name' : 'issues',
                                'value': 22
                            },
                            {
                                'name' : 'closed issues',
                                'value': 17
                            }
                        ]
                    }
                ]
            },
            // 'supporting': {
            //     'created'  : {
            //         'label': 'CREATED',
            //         'count': {
            //             '2W': 48,
            //             'LW': 46,
            //             'TW': 54
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'CREATED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'Created',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'Created',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 2
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 1
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 4
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     'closed'   : {
            //         'label': 'CLOSED',
            //         'count': {
            //             '2W': 27,
            //             'LW': 31,
            //             'TW': 26
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'CLOSED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 2
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 1
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 4
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'CLOSED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'CLOSED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     'reOpened' : {
            //         'label': 'RE-OPENED',
            //         'count': {
            //             '2W': 4,
            //             'LW': 5,
            //             'TW': 2
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'RE-OPENED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'RE-OPENED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 1
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'RE-OPENED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 2
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 1
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 4
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     'wontFix'  : {
            //         'label': 'WON\'T FIX',
            //         'count': {
            //             '2W': 6,
            //             'LW': 3,
            //             'TW': 4
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'WON\'T FIX',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 2
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'WON\'T FIX',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'WON\'T FIX',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     'needsTest': {
            //         'label': 'NEEDS TEST',
            //         'count': {
            //             '2W': 10,
            //             'LW': 7,
            //             'TW': 8
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'NEEDS TEST',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'NEEDS TEST',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 1
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'NEEDS TEST',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     },
            //     'fixed'    : {
            //         'label': 'FIXED',
            //         'count': {
            //             '2W': 21,
            //             'LW': 17,
            //             'TW': 14
            //         },
            //         'chart': {
            //             '2W': [
            //                 {
            //                     'name'  : 'FIXED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 8
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 1
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'LW': [
            //                 {
            //                     'name'  : 'FIXED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 7
            //                         }
            //                     ]
            //                 }
            //             ],
            //             'TW': [
            //                 {
            //                     'name'  : 'FIXED',
            //                     'series': [
            //                         {
            //                             'name' : 'Mon',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Tue',
            //                             'value': 7
            //                         },
            //                         {
            //                             'name' : 'Wed',
            //                             'value': 4
            //                         },
            //                         {
            //                             'name' : 'Thu',
            //                             'value': 6
            //                         },
            //                         {
            //                             'name' : 'Fri',
            //                             'value': 5
            //                         },
            //                         {
            //                             'name' : 'Sat',
            //                             'value': 3
            //                         },
            //                         {
            //                             'name' : 'Sun',
            //                             'value': 2
            //                         }
            //                     ]
            //                 }
            //             ]
            //         }
            //     }
            // }
        },
    };

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
    }
    projects: any[];
    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

/**
     * Get projects
     *
     * @returns {Promise<any>}
     */
    getProjects(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/project-dashboard-projects')
                .subscribe((response: any) => {
                    this.projects = response;
                    resolve(response);
                }, reject);
        });
    }


    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';
// @Injectable()

// export class GraphsService implements Resolve<any>
// {
//     projects: any[];
//     widgets: any[];

//     /**
//      * Constructor
//      *
//      * @param {HttpClient} _httpClient
//      */
//     constructor(
//         private _httpClient: HttpClient
//     )
//     {
//     }

//     /**
//      * Resolver
//      *
//      * @param {ActivatedRouteSnapshot} route
//      * @param {RouterStateSnapshot} state
//      * @returns {Observable<any> | Promise<any> | any}
//      */
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
//     {

//         return new Promise((resolve, reject) => {

//             Promise.all([
//                 this.getProjects(),
//                 this.getWidgets()
//             ]).then(
//                 () => {
//                     resolve();
//                 },
//                 reject
//             );
//         });
//     }

//     /**
//      * Get projects
//      *
//      * @returns {Promise<any>}
//      */
//     getProjects(): Promise<any>
//     {
//         return new Promise((resolve, reject) => {
//             this._httpClient.get('api/project-dashboard-projects')
//                 .subscribe((response: any) => {
                   
//                     this.projects = response;
//                     console.log('this projecats 123');
//                     console.log(this.projects)  

//                     resolve(response);
//                 }, reject);
//         });
//     }

//     /**
//      * Get widgets
//      *
//      * @returns {Promise<any>}
//      */
//     getWidgets(): Promise<any>
//     {
//         return new Promise((resolve, reject) => {
//             this._httpClient.get('api/project-dashboard-widgets')
//                 .subscribe((response: any) => {
//                     this.widgets = response;
//                     resolve(response);
//                 }, reject);
//         });
//     }
// }
