/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { BallerinaConnectorInfo, STSymbolInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { getFormattedModuleName } from "../components/Portals/utils";

export function getAllModuleVariables(symbolInfo: STSymbolInfo): string[] {
    const moduleVariableCollection: string[] = [];
    symbolInfo?.moduleVariables?.forEach((stNode, key) => {
        moduleVariableCollection.push(key);
    });
    return moduleVariableCollection;
}

// this function will return existing module variable name
export function getModuleVariable(symbolInfo: STSymbolInfo, connectorInfo: BallerinaConnectorInfo): string {
    const moduleName = getFormattedModuleName(connectorInfo.package.name);
    let variableName: string;
    symbolInfo.variables?.forEach((nodes, type) => {
        if (type === `${moduleName}:${connectorInfo.name}` && nodes.length > 0 && variableName === undefined){
            // get first variable
            variableName = (nodes[0] as any)?.typedBindingPattern.bindingPattern?.variableName.value;
            return variableName;
        }
    });

    return variableName;
}
