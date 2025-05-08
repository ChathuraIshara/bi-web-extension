// /**
//  * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */

// import { Uri, WorkspaceFolder } from 'vscode';
// import { NodePosition } from "@wso2-enterprise/syntax-tree";

// export enum ViewMode {
//     LOW_CODE,
//     OVERVIEW
// }

// export interface DiagramFocus {
//     fileUri: string;
//     position?: NodePosition;
// }

// export interface DiagramOptions {
//     startLine?: number;
//     startColumn?: number;
//     isDiagram: boolean;
//     fileUri?: Uri;
//     diagramFocus?: DiagramFocus;
//     workspaceName?: string;
//     projectPaths?: WorkspaceFolder[];
// }

// export interface SyntaxTree {
//     members: Member[];
// }

// export interface Member {
//     kind: string;
//     position: Position;
//     functionName?: {
//         value: string;
//         position: Position;
//     };
//     members: Member[];
//     relativeResourcePath?: ResourcePath[];
// }

// interface Position {
//     startLine: number;
//     startColumn: number;
//     endLine: number;
//     endColumn: number;
// }

// interface ResourcePath {
//     value: string;
// }

// export interface DiagnosticInfo {
//     code: string;
//     severity: string;
// }

// export interface Diagnostic {
//     message: string;
//     diagnosticInfo: DiagnosticInfo;
//     range: Position;
// }
