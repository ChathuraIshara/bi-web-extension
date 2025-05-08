/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { URLSearchParams } from "url";
import { window, Uri, ProviderResult, commands } from "vscode";
import { exchangeAuthCode } from "./ai-panel/auth";
import { COMMANDS } from "./constants";
import { checkForDevantExt } from "./extension";
import { IOpenCompSrcCmdParams, CommandIds as PlatformExtCommandIds } from "@wso2-enterprise/wso2-platform-core";

export function activateUriHandlers() {
    window.registerUriHandler({
        handleUri(uri: Uri): ProviderResult<void> {
            const urlParams = new URLSearchParams(uri.query);
            switch (uri.path) {
                case '/signin':
                    console.log("Signin callback hit");
                    const query = new URLSearchParams(uri.query);
                    const code = query.get('code');
                    console.log("Code: " + code);
                    if (code) {
                        exchangeAuthCode(code);
                    } else {
                        window.showErrorMessage('Auth code not found');
                    }
                    break;
                case '/open':
                    if(!checkForDevantExt()) {
                        return;
                    }
                    const org = urlParams.get("org");
                    const project = urlParams.get("project");
                    const component = urlParams.get("component");
                    const technology = urlParams.get("technology");
                    const integrationType = urlParams.get("integrationType");
                    const integrationDisplayType = urlParams.get("integrationDisplayType");
                    window.showInformationMessage('Opening component');
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
