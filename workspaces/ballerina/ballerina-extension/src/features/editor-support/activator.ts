/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { isSupportedVersion, VERSION } from "../../utils";
import { languages, workspace } from "vscode";
import { BallerinaExtension, LANGUAGE } from "../../core";
import { ExecutorCodeLensProvider } from "./codelens-provider";
import { ReadOnlyContentProvider } from "./readonly-content-provider";
import { StringSplitFeature, StringSplitter } from "./split-provider";
import * as gitStatus from "./git-status";

export function activate(ballerinaExtInstance: BallerinaExtension) {
    if (!ballerinaExtInstance.context || !ballerinaExtInstance.langClient) {
        return;
    }
    if (isSupportedVersion(ballerinaExtInstance, VERSION.ALPHA, 5)) {
        ballerinaExtInstance.context!.subscriptions.push(new StringSplitFeature(new StringSplitter(),
            ballerinaExtInstance));
    }

    // Create new content provider for ballerina library files
    const blProvider = new ReadOnlyContentProvider();
    ballerinaExtInstance.context.subscriptions.push(workspace.registerTextDocumentContentProvider('bala', blProvider));

    gitStatus.activate(ballerinaExtInstance);

    if (!ballerinaExtInstance.isAllCodeLensEnabled()) {
        return;
    }
    if (ballerinaExtInstance.isAllCodeLensEnabled() && isSupportedVersion(ballerinaExtInstance, VERSION.BETA, 1)) {
        languages.registerCodeLensProvider([{ language: LANGUAGE.BALLERINA, scheme: 'file' }],
            new ExecutorCodeLensProvider(ballerinaExtInstance));
    }
}
