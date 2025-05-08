/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ConstDeclaration, STKindChecker } from "@wso2-enterprise/syntax-tree";

export const ConstantVarNameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");

export interface ConstantConfigFormState {
    isPublic: boolean;
    isTypeDefined: boolean;
    constantName: string;
    constantValue: string;
    constantType: string;
    isExpressionValid: boolean;
}

export function isFormConfigValid(config: ConstantConfigFormState): boolean {
    const { constantValue, constantName, constantType, isTypeDefined, isExpressionValid } = config;
    if (isTypeDefined) {
        return constantName.length > 0 && ConstantVarNameRegex.test(constantName) && constantType.length > 0
            && isExpressionValid && constantValue.length > 0;

    } else {
        return constantName.length > 0 && ConstantVarNameRegex.test(constantName) && isExpressionValid
            && constantValue.length > 0;
    }
}

export function generateConfigFromModel(model: ConstDeclaration): ConstantConfigFormState {
    const defaultConstantFormState: ConstantConfigFormState = {
        isPublic: false,
        isTypeDefined: false,
        constantName: '',
        constantType: '',
        constantValue: '',
        isExpressionValid: false
    }

    if (model) {
        defaultConstantFormState.isPublic = model.visibilityQualifier
            && STKindChecker.isPublicKeyword(model.visibilityQualifier);
        defaultConstantFormState.isTypeDefined = model.typeDescriptor !== undefined;

        if (defaultConstantFormState.isTypeDefined) {
            defaultConstantFormState.constantType = model.typeDescriptor.typeData.symbol?.typeKind;
        }

        defaultConstantFormState.constantValue = model.initializer.source;
        defaultConstantFormState.constantName = model.variableName.value;
        defaultConstantFormState.isExpressionValid = true;
    }

    return defaultConstantFormState;
}
