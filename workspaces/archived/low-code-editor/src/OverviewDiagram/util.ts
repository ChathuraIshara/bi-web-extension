/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ComponentInfo, ModuleSummary, PackageSummary } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { Uri } from "monaco-editor";

import { extractFilePath } from "../DiagramViewManager/utils";

export interface ComponentViewInfo {
    filePath: string;
    position: NodePosition;
    fileName?: string;
    moduleName?: string;
    uid?: string;
    name?: string;
}

export interface ComponentCollection {
    functions: ComponentViewInfo[];
    services: ComponentViewInfo[];
    records: ComponentViewInfo[];
    objects: ComponentViewInfo[];
    classes: ComponentViewInfo[];
    types: ComponentViewInfo[];
    constants: ComponentViewInfo[];
    enums: ComponentViewInfo[];
    listeners: ComponentViewInfo[];
    moduleVariables: ComponentViewInfo[];
}


export function genFilePath(packageInfo: PackageSummary, module: ModuleSummary, element: ComponentInfo) {
    let filePath = Uri.parse(`${packageInfo.filePath}${module.name ? `modules/${module.name}/` : ''}${element.filePath}`).toString();

    filePath = extractFilePath(filePath);

    return filePath;
}

