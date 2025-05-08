/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExpressionFieldValue } from "../ExpressionField/ExpressionInput";

export const isExpressionFieldValue = (value: string | ExpressionFieldValue): value is ExpressionFieldValue => {
    return typeof value === 'object';
}

export const getValue = (value: string | ExpressionFieldValue): string => {
    return isExpressionFieldValue(value) ? value.value : value;
}

