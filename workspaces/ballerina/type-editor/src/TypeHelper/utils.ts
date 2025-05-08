/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MutableRefObject } from 'react';
import { TypeHelperCategory } from '.';

export const isTypePanelOpen = (activePanelIndex: number) => {
    return activePanelIndex === 0;
};

export const getTypeCreateText = (
    typeName: string,
    referenceTypes: TypeHelperCategory[],
    newTypeName: MutableRefObject<string>
) => {
    if (!typeName) {
        newTypeName.current = '';
        return 'Create New Type';
    }

    const isValidType = typeName.match(/^[a-zA-Z_'][a-zA-Z0-9_]*$/);
    if (!isValidType) {
        newTypeName.current = '';
        return 'Create New Type';
    }

    let typeExists: boolean = false;
    for (const category of referenceTypes) {
        if (category.items.find((item) => item.name === typeName)) {
            typeExists = true;
            break;
        }
    }

    if (!typeExists) {
        newTypeName.current = typeName;
        return `Add Type: ${typeName}`;
    } else {
        newTypeName.current = '';
        return 'Create New Type';
    }
};
