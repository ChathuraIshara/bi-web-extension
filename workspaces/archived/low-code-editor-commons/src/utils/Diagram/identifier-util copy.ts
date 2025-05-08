/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { CaptureBindingPattern, LocalVarDecl, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";

import { STSymbolInfo } from "../../types";

export function getAllVariablesForAi(symbolInfo: STSymbolInfo): { [key: string]: any } {
    const variableCollection: { [key: string]: any } = {};
    symbolInfo.variables.forEach((variableNodes: STNode[], type: string) => {
        variableNodes.forEach((variableNode) => {
            if (STKindChecker.isRequiredParam(variableNode)) {
                // Handle function definition params
                variableCollection[variableNode.paramName.value] = {
                    "type": type,
                    "position": 0,
                    "isUsed": 0
                }
            } else if (STKindChecker.isLocalVarDecl(variableNode)) {
                const variableDef: LocalVarDecl = variableNode as LocalVarDecl;
                if (STKindChecker.isCaptureBindingPattern(variableDef.typedBindingPattern.bindingPattern) &&
                    variableDef.typedBindingPattern.bindingPattern.variableName) {
                    variableCollection[variableDef.typedBindingPattern.bindingPattern.variableName.value] = {
                        "type": type,
                        "position": 0,
                        "isUsed": 0
                    }
                }
            }
        });
    });
    symbolInfo.moduleVariables.forEach((variableNode: STNode, type: string) => {
        if (STKindChecker.isModuleVarDecl(variableNode) && !variableCollection[type]){
            variableCollection[type] = {
                "type": type,
                "position": 0,
                "isUsed": 0
            }
        }
    });
    symbolInfo.enums.forEach((variableNode: STNode, type: string) => {
        if (STKindChecker.isEnumDeclaration(variableNode) && !variableCollection[type]) {
            variableCollection[type] = {
                "type": type,
                "position": 0,
                "isUsed": 0
            }
        }
    });
    symbolInfo.recordTypeDescriptions.forEach((variableNode: STNode, type: string) => {
        if (STKindChecker.isRecordTypeDesc(variableNode) && !variableCollection[type]) {
            variableCollection[type] = {
                "type": type,
                "position": 0,
                "isUsed": 0
            }
        }
    });
    symbolInfo.localEndpoints.forEach((variableNodes: STNode, type: string) => {
        const variableDef: LocalVarDecl = variableNodes as LocalVarDecl;
        const variable: CaptureBindingPattern = variableDef.typedBindingPattern.bindingPattern as
            CaptureBindingPattern;
        if (!variableCollection[variable.variableName.value]) {
            variableCollection[variable.variableName.value] = {
                "type": type,
                "position": 0,
                "isUsed": 0
            }
        }
    });
    symbolInfo.actions.forEach((variableNodes: STNode, type: string) => {
        if (variableNodes.kind === "LocalVarDecl") {
            const variableDef: LocalVarDecl = variableNodes as LocalVarDecl;
            const variable: CaptureBindingPattern = variableDef.typedBindingPattern.bindingPattern as
                CaptureBindingPattern;
            if (!variableCollection[variable.variableName.value]) {
                variableCollection[variable.variableName.value] = {
                    "type": type,
                    "position": 0,
                    "isUsed": 0
                }
            }
        }
    });
    return variableCollection;
}

export function getAllVariables(symbolInfo: STSymbolInfo): string[] {
    const variableCollection: string[] = [];
    const variableInfo = getAllVariablesForAi(symbolInfo);
    Object.keys(variableInfo).map((variable) => {
        variableCollection.push(variable);
    });
    return variableCollection;
}

export function genVariableName(defaultName: string, variables: string[]): string {
    const baseName: string = convertToCamelCase(defaultName);
    let varName: string = baseName.includes('.') ? baseName.split('.').pop() : baseName;
    let index = 0;
    while (variables.includes(varName)) {
        index++;
        varName = baseName + index;
    }
    return varName;
}

function convertToCamelCase(variableName: string): string {
    return variableName
        .replace(/\s(.)/g, (a) => {
            return a.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, (b) => {
            return b.toLowerCase();
        });
}
