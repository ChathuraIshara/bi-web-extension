/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { SwaggerWebview } from './webview';
import { SwaggerData } from '@wso2-enterprise/mi-core';

export async function openSwaggerWebview(swaggerData: SwaggerData) {
    if (!SwaggerWebview.currentPanel) {
        SwaggerWebview.currentPanel = new SwaggerWebview(swaggerData);
    } else {
        SwaggerWebview.currentPanel!.getWebview()?.reveal();
    }
}
