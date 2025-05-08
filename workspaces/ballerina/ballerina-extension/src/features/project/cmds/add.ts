/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ballerinaExtInstance, LANGUAGE } from "../../../core";
import { commands, window } from "vscode";
// import {
//     TM_EVENT_PROJECT_ADD, TM_EVENT_ERROR_EXECUTE_PROJECT_ADD, CMP_PROJECT_ADD, sendTelemetryEvent, sendTelemetryException, getMessageObject
// } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS, MESSAGES, PROJECT_TYPE, PALETTE_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject } from "../../../utils/project-utils";

function activateAddCommand() {
    // register ballerina add handler
    commands.registerCommand(PALETTE_COMMANDS.ADD, async () => {
        try {
          //  sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_PROJECT_ADD, CMP_PROJECT_ADD);

            if (window.activeTextEditor && window.activeTextEditor.document.languageId != LANGUAGE.BALLERINA) {
                window.showErrorMessage(MESSAGES.NOT_IN_PROJECT);
                return;
            }

            const currentProject = ballerinaExtInstance.getDocumentContext().isActiveDiagram() ? await
                getCurrentBallerinaProject(ballerinaExtInstance.getDocumentContext().getLatestDocument()?.toString())
                : await getCurrentBallerinaProject();
            if (currentProject.kind === PROJECT_TYPE.SINGLE_FILE || !currentProject.path) {
               // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_ERROR_EXECUTE_PROJECT_ADD, CMP_PROJECT_ADD,
                 //   getMessageObject(MESSAGES.NOT_IN_PROJECT));
                window.showErrorMessage(MESSAGES.NOT_IN_PROJECT);
                return;
            }

            const moduleName = await window.showInputBox({ placeHolder: MESSAGES.MODULE_NAME });
            if (moduleName && moduleName.trim().length > 0) {
                runCommand(currentProject, ballerinaExtInstance.getBallerinaCmd(), BALLERINA_COMMANDS.ADD,
                    moduleName);
            }

        } catch (error) {
            if (error instanceof Error) {
              //  sendTelemetryException(ballerinaExtInstance, error, CMP_PROJECT_ADD);
                window.showErrorMessage(error.message);
            } else {
                window.showErrorMessage("Unkown error occurred.");
            }
        }
    });
}

export { activateAddCommand };
