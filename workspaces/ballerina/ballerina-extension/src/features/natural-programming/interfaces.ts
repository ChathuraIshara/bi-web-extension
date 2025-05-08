/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import vscode from 'vscode';

export interface BallerinaPluginConfig extends vscode.WorkspaceConfiguration {
    home?: string;
    debugLog?: boolean;
    classpath?: string;
}

export interface ResultItem {
    id: string;
    fileName: string;
    codeFileName: string;
    startRowforImplementationChangedAction: number;
    endRowforImplementationChangedAction: number;
    startRowforDocChangedAction: number;
    endRowforDocChangedAction: number;
    implementationChangeSolution: string;
    docChangeSolution: string;
    cause: string;
}

export interface DriftResponseData {
    results: ResultItem[];
}

export interface DriftResponse {
    drift : string;
}

export interface BallerinaSource {
    balFiles: string; 
    readme: string; 
    requirements: string; 
    developerOverview: string; 
    moduleName: string;
}
