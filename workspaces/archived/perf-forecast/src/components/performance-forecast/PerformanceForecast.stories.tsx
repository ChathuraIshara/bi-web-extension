
import { Meta } from '@storybook/react';
import React from 'react';

import { PerformanceForecast } from './PerformanceForecast';

const data =
{
    "criticalPath": 0,
    "pathmaps": {
        "0": [
            "0",
            "1"
        ],
        "1": [
            "0",
            "1"
        ]
    },
    "paths": {
        "0": {
            "graphData": [
                {
                    "concurrency": 1,
                    "latency": 63,
                    "tps": 15.77
                },
                {
                    "concurrency": 25,
                    "latency": 2129,
                    "tps": 11.74
                },
                {
                    "concurrency": 50,
                    "latency": 7075,
                    "tps": 7.07
                },
                {
                    "concurrency": 75,
                    "latency": 15374,
                    "tps": 4.88
                },
                {
                    "concurrency": 100,
                    "latency": 27022,
                    "tps": 3.7
                }
            ],
            "sequenceDiagramData": {
                "concurrency": {
                    "max": 25,
                    "min": 1
                },
                "connectorLatencies": {
                    "0": {
                        "max": 2129,
                        "min": 39.26156997680664
                    },
                    "1": {
                        "max": 2129,
                        "min": 24.138883590698242
                    }
                },
                "latency": {
                    "max": 3900,
                    "min": 24
                },
                "tps": {
                    "max": 15.77,
                    "min": 11.74
                }
            }
        },
        "1": {
            "graphData": [],
            "sequenceDiagramData": {
                "concurrency": {
                    "max": 25,
                    "min": 1
                },
                "connectorLatencies": {
                    "0": {
                        "max": 2129,
                        "min": 39
                    },
                    "1": {
                        "max": 2129,
                        "min": 24
                    }
                },
                "latency": {
                    "max": 39,
                    "min": 24
                },
                "tps": {
                    "max": 15.77,
                    "min": 11.74
                }
            }
        }
    },
    "positions": {
        "0": {
            "name": "Client",
            "pkgID": "ballerina/http",
            "pos": "main.bal/(15:38,15:84)"
        },
        "1": {
            "name": "Client",
            "pkgID": "ballerina/http",
            "pos": "main.bal/(15:38,15:84)"
        }
    }
};

export default {
    component: PerformanceForecast,
    title: 'Components/PerformanceForecast',
} as Meta;

export const Primary: React.VFC<{}> = () => <PerformanceForecast name={"test"} data={data}></PerformanceForecast>;
