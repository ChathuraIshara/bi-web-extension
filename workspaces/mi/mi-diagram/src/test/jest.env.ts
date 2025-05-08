/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

global.structuredClone = (val: any) => {
    return JSON.parse(JSON.stringify(val))
}

global.setImmediate = global.setImmediate || ((fn: any, ...args: any) => global.setTimeout(fn, 0, ...args)) as any;

jest.mock('resize-observer-polyfill', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                constructor: () => { },
                disconnect: () => { },
                observe: () => { }
            }
        })
    }
})
