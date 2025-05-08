/* eslint-disable @typescript-eslint/no-explicit-any */

import { STNode } from "@wso2-enterprise/syntax-tree";
import { FlowNode, RecordTypeField } from "./bi";

/**
* Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
*
* This software is the property of WSO2 LLC. and its suppliers, if any.
* Dissemination of any information or reproduction of any material contained
* herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
* You may not alter or remove any copyright or other notice from copies of this content.
*/
export declare enum BallerinaComponentTypes {
    REST_API = "restAPI",
    GRAPHQL = "graphql",
    MAIN = "main",
    WEBHOOK = "webhook",
    GRPC_API = "grpcAPI",
    WEBSOCKET_API = "websocketAPI"
}

export enum SubPanelView {
    INLINE_DATA_MAPPER = "inlineDataMapper",
    HELPER_PANEL = "helperPanel",
    ADD_NEW_FORM = "addNewForm",
    UNDEFINED = undefined,
}

export interface DocumentIdentifier {
    uri: string;
}

export interface LineRange {
    fileName?: string;
    startLine: LinePosition;
    endLine: LinePosition;
}

export interface LinePosition {
    line: number;
    offset: number;
}

export interface Range {
    start: Position;
    end: Position;
}

export interface Position {
    line: number;
    character: number;
}

export interface NOT_SUPPORTED_TYPE {

}
export interface FunctionDef {
    syntaxTree: STNode;
    defFilePath: string;
}

export interface SubPanel {
    view: SubPanelView;
    props?: SubPanelViewProps;
}

export interface SubPanelViewProps {
    inlineDataMapper?: InlineDataMapperProps;
    sidePanelData?: SidePanelData;
}

export interface SidePanelData {
    filePath: string;
    range: LineRange;
    editorKey: string;
    configurePanelData?: ConfigurePanelData;
    recordField: RecordTypeField;
}

export interface ConfigurePanelData {
    isEnable: boolean;
    name?: string;
    documentation?: string;
    value?: string;
}

interface InlineDataMapperProps {
    filePath: string;
    flowNode: FlowNode;
    propertyKey: string;
    editorKey: string;
    position: LinePosition;
}
