/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { STKindChecker } from "@wso2-enterprise/syntax-tree";

import { getVariableNameFromST } from "../../../../../utils/st-util";

export const ModuleVarNameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");

export interface ModuleVariableFormState {
    varType: string;
    varName: string;
    varValue: string;
    varOptions: string[];
}

export interface ModuleVariableFormStateWithValidity extends ModuleVariableFormState{
    isExpressionValid: boolean;
}

export enum VariableOptions {
    FINAL = 'final',
    PUBLIC = 'public',
}

export function getFormConfigFromModel(model: any): ModuleVariableFormStateWithValidity {
    // FixMe: model is set to any type due to missing properties in ST interface
    const defaultFormState: ModuleVariableFormStateWithValidity = {
        varType: 'int',
        varName: '',
        varValue: 'EXPRESSION',
        varOptions: [],
        isExpressionValid: true,
    }

    if (model) {
        if (model?.qualifiers?.length > 0
            && model.qualifiers.filter((qualifier: any) => STKindChecker.isFinalKeyword(qualifier)).length > 0) {
            defaultFormState.varOptions.push(VariableOptions.FINAL);
        }

        const typeData = model?.initializer?.typeData;

        if (model?.typedBindingPattern?.typeDescriptor) {
            defaultFormState.varType = model?.typedBindingPattern?.typeDescriptor?.name?.value;
        } else if (typeData) {
            const typeSymbol = typeData.typeSymbol;
            if (typeSymbol) {
                defaultFormState.varType = typeSymbol.typeKind;
            }
        }

        if (model.visibilityQualifier && STKindChecker.isPublicKeyword(model.visibilityQualifier)) {
            defaultFormState.varOptions.push(VariableOptions.PUBLIC);
        }

        defaultFormState.varValue = model.initializer ? model.initializer.source : "";
        defaultFormState.varName = getVariableNameFromST(model);

        return defaultFormState;
    }

    return defaultFormState;
}

export function isFormConfigValid(config: ModuleVariableFormStateWithValidity): boolean {
    const { varName, varValue, isExpressionValid } = config;

    return varName.length > 0 && ModuleVarNameRegex.test(varName) && isExpressionValid;
}
