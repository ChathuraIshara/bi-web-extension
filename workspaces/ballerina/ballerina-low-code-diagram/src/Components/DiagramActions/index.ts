/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export interface PortalData {
    canvasX: number;
    canvasY: number;
    canvasH: number;
    canvasW: number;
}

export interface DropDownPortalData {
    componentName?: string;
    portalX: number;
    portalY: number;
    offsetX?: number;
    offsetY?: number;
    collection?: any[];
    onClick?: () => void;
}
