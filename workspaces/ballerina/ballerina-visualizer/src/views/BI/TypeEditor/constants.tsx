/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Icon } from "@wso2-enterprise/ui-toolkit";
import type { TypeHelperOperator } from "@wso2-enterprise/type-editor";

export const TYPE_HELPER_OPERATORS: TypeHelperOperator[] = [
    {
        name: 'Convert type to array',
        getIcon: () => <Icon name="type-array" />,
        insertType: 'global',
        insertText: '[]',
        insertLocation: 'end'
    },
    {
        name: 'Add union type',
        getIcon: () => <Icon name="type-union" />,
        insertType: 'local',
        insertText: '|'
    },
    {
        name: 'Convert to nil type',
        getIcon: () => <Icon name="type-optional" />,
        insertType: 'global',
        insertText: '?',
        insertLocation: 'end'
    },
    {
        name: 'Convert to readonly type',
        getIcon: () => <Icon name="type-readonly" />,
        insertType: 'global',
        insertText: 'readonly',
        insertLocation: 'start'
    }
];
