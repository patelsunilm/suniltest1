import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class GraphsService implements Resolve<any>
{
    widgets =  {
        widget1: {
            chartType: 'line',
            datasets: {
                '2016': [
                    {
                        label: 'Sales',
                        data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9],
                        fill: 'start'

                    }
                ],
                '2017': [
                    {
                        label: 'Sales',
                        data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8],
                        fill: 'start'

                    }
                ],
                '2018': [
                    {
                        label: 'Sales',
                        data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
                        fill: 'start'

                    }
                ]

            },
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            colors: [
                {
                    borderColor: '#42a5f5',
                    backgroundColor: '#42a5f5',
                    pointBackgroundColor: '#1e88e5',
                    pointHoverBackgroundColor: '#1e88e5',
                    pointBorderColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff'
                }
            ],
            options: {
                spanGaps: false,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 32,
                        left: 32,
                        right: 32
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 2,
                        hoverRadius: 4,
                        hoverBorderWidth: 2
                    },
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                                drawBorder: false,
                                tickMarkLength: 18
                            },
                            ticks: {
                                fontColor: '#ffffff'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            ticks: {
                                min: 1.5,
                                max: 5,
                                stepSize: 0.5
                            }
                        }
                    ]
                },
                plugins: {
                    filler: {
                        propagate: false
                    },
                    xLabelsOnTop: {
                        active: true
                    }
                }
            }
        }
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
