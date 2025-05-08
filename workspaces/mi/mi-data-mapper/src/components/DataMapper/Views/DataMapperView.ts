/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum SourceNodeType {
    InputNode,
    FocusedInputNode,
    SubMappingNode
}

export interface View {
    targetFieldFQN: string;
    sourceFieldFQN: string;
    sourceNodeType: SourceNodeType;
    label: string;
    mapFnIndex?: number;
    subMappingInfo?: SubMappingInfo;
}

export interface SubMappingInfo {
    index: number;
    mappingName: string;
    mappingType: string;
    mapFnIndex?: number;
    focusedOnSubMappingRoot?: boolean;
}
