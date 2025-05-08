/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { URLSearchParams } from "url";
import { window, Uri, ProviderResult, commands } from "vscode";
import { BallerinaExtension } from "../core";
import { handleOpenFile, handleOpenRepo } from ".";
// import { CMP_OPEN_VSCODE_URL, TM_EVENT_OPEN_FILE_URL_START, TM_EVENT_OPEN_REPO_URL_START, sendTelemetryEvent } from "../features/telemetry";
import { exchangeAuthCode } from "../views/ai-panel/auth";
import { IOpenCompSrcCmdParams, CommandIds as PlatformExtCommandIds } from "@wso2-enterprise/wso2-platform-core";

export function activateUriHandlers(ballerinaExtInstance: BallerinaExtension) {
    window.registerUriHandler({
        handleUri(uri: Uri): ProviderResult<void> {
            const urlParams = new URLSearchParams(uri.query);
            switch (uri.path) {
                case '/open-file':
                    const gistId = urlParams.get('gist');
                    const fileName = urlParams.get('file');
                    const repoFileUrl = urlParams.get('repoFileUrl');
                   // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_FILE_URL_START, CMP_OPEN_VSCODE_URL);
                    if ((gistId && fileName) || repoFileUrl) {
                        handleOpenFile(ballerinaExtInstance, gistId, fileName, repoFileUrl);
                    } else {
                        window.showErrorMessage(`Gist or the file not found!`);
                    }
                    break;
                case '/open-repo':
                    const repoUrl = urlParams.get('repoUrl');
                    const openFile = urlParams.get('openFile');
                  //  sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_REPO_URL_START, CMP_OPEN_VSCODE_URL);
                    if (repoUrl) {
                        handleOpenRepo(ballerinaExtInstance, repoUrl, openFile);
                    } else {
                        window.showErrorMessage(`Repository url not found!`);
                    }
                    break;
                case '/signin':
                    console.log("Signin callback hit");
                    const query = new URLSearchParams(uri.query);
                    const code = query.get('code');
                    console.log("Code: " + code);
                    if (code) {
                        exchangeAuthCode(code);
                    }
                    console.log("Auth code not found. Ignoring");
                    break;
                case '/open':
                    const org = urlParams.get("org");
                    const project = urlParams.get("project");
                    const component = urlParams.get("component");
                    const technology = urlParams.get("technology");
                    const integrationType = urlParams.get("integrationType");
                    const integrationDisplayType = urlParams.get("integrationDisplayType");
                    if (org && project && component && technology && integrationType) {
                        commands.executeCommand(PlatformExtCommandIds.OpenCompSrcDir, {
                            org, project, component, technology, integrationType, integrationDisplayType, extName: "Devant"
                        } as IOpenCompSrcCmdParams);
                    } else {
                        window.showErrorMessage('Invalid component URL parameters');
                    }
                    break;

            }
        }
    });
}
