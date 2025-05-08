/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { EVENT_TYPE, VisualizerLocation } from "../../state-machine-types";

export interface UpdateUndoRedoMangerRequest {
    filePath: string;
    fileContent: string;
}

export interface OpenViewRequest {
    type: EVENT_TYPE;
    location: VisualizerLocation;
    isPopup?: boolean;
}

export interface GetWorkspaceContextResponse {
    context: string[];
}