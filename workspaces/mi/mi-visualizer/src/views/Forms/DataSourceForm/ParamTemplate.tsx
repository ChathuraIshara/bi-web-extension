/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

interface DataSourceConfigParameter {
    name?: string;
    type: string;
    value?: string | number | boolean;
    items?: { content: string; value: string }[];
    validate?: {
        type: string;
        required?: boolean;
        min?: number;
        max?: number;
        patter?: string;
    };
}

interface ParamPool {
    [key: string]: DataSourceConfigParameter;
}

export const dataSourceParams: ParamPool = {
    defaultAutoCommit: {
        name: 'Default Auto Commit',
        type: 'checkbox',
    },
    defaultReadOnly: {
        name: 'Default Read Only',
        type: 'checkbox',
    },
    defaultTransactionIsolation: {
        name: 'Default Transaction Isolation',
        type: 'dropdown',
        items: [
            {
                content: "NONE",
                value: "NONE",
            },
            {
                content: "READ_COMMITTED",
                value: "READ_COMMITTED",
            },
            {
                content: "READ_UNCOMMITTED",
                value: "READ_UNCOMMITTED",
            },
            {
                content: "REPEATABLE_READ",
                value: "REPEATABLE_READ",
            },
            {
                content: "SERIALIZABLE",
                value: "SERIALIZABLE",
            },
        ],
        value: 'NONE',
    },
    defaultCatalog: {
        name: 'Default Catalog',
        type: 'text',
    },
    maxActive: {
        name: 'Max Active',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    maxIdle: {
        name: 'Max Idle',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    minIdle: {
        name: 'Min Idle',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    initialSize: {
        name: 'Initial Size',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    maxWait: {
        name: 'Max Wait (ms)',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    testOnBorrow: {
        name: 'Test On Borrow',
        type: 'checkbox',
    },
    testOnReturn: {
        name: 'Test On Return',
        type: 'checkbox',
    },
    testWhileIdle: {
        name: 'Test While Idle',
        type: 'checkbox',
    },
    validationQuery: {
        name: 'Validation Query',
        type: 'text',
    },
    validatorClassName: {
        name: 'Validator Class Name',
        type: 'text',
    },
    timeBetweenEvictionRunsMillis: {
        name: 'Time Between Eviction Runs Millis',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    numTestsPerEvictionRun: {
        name: 'Num Tests Per Eviction Run',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    minEvictableIdleTimeMillis: {
        name: 'Min Evictable Idle Time Millis',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    accessToUnderlyingConnectionAllowed: {
        name: 'Access To Underlying Connection Allowed',
        type: 'checkbox',
    },
    removeAbandoned: {
        name: 'Remove Abandoned',
        type: 'checkbox',
    },
    removeAbandonedTimeout: {
        name: 'Remove Abandoned Timeout',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    logAbandoned: {
        name: 'Log Abandoned',
        type: 'checkbox',
    },
    connectionProperties: {
        name: 'Connection Properties',
        type: 'text',
    },
    initSQL: {
        name: 'Init SQL',
        type: 'text',
    },
    jdbcInterceptors: {
        name: 'JDBC Interceptors',
        type: 'text',
    },
    validationInterval: {
        name: 'Validation Interval',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    jmxEnabled: {
        name: 'JMX Enabled',
        type: 'checkbox',
    },
    fairQueue: {
        name: 'Fair Queue',
        type: 'checkbox',
    },
    abandonWhenPercentageFull: {
        name: 'Abandon When Percentage Full',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    maxAge: {
        name: 'Max Age',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    useEquals: {
        name: 'Use Equals',
        type: 'checkbox',
    },
    suspectTimeout: {
        name: 'Suspect Timeout',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
    alternateUsernameAllowed: {
        name: 'Alternate Username Allowed',
        type: 'checkbox',
    },
    validationQueryTimeout: {
        name: 'Validation Query Timeout',
        type: 'text',
        validate: {
            type: 'number',
        },
    },
};
