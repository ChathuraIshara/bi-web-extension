/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ballerinaExtInstance } from "./../../core";
import { commands, window } from "vscode";
// import {
//     TM_EVENT_AUTH_COPILOT, CMP_AUTH_COPILOT, sendTelemetryEvent,
//     sendTelemetryException
// } from "./../telemetry";
import { PALETTE_COMMANDS } from "./../project/cmds/cmd-runner";
import { loginGithubCopilot } from '../../utils/ai/auth';

export function activateCopilotLoginCommand() {
    commands.registerCommand(PALETTE_COMMANDS.LOGIN_COPILOT, async () => {
        try {
           // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_AUTH_COPILOT, CMP_AUTH_COPILOT);
            await loginGithubCopilot();
        } catch (error) {
            if (error instanceof Error) {
              //  sendTelemetryException(ballerinaExtInstance, error, CMP_AUTH_COPILOT);
                window.showErrorMessage(error.message);
            } else {
                window.showErrorMessage("Unkown error occurred.");
            }
        }
    });
}

export function resetBIAuth() {
    commands.registerCommand(PALETTE_COMMANDS.RESET_BI, async () => {
        await ballerinaExtInstance.context.secrets.delete('GITHUB_TOKEN');
        await ballerinaExtInstance.context.secrets.delete('GITHUB_COPILOT_TOKEN');
        await ballerinaExtInstance.context.secrets.delete('LOGIN_ALERT_SHOWN');
    });
}
