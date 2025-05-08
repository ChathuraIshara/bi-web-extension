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
//     TM_EVENT_PROJECT_DOC, TM_EVENT_ERROR_EXECUTE_PROJECT_DOC, CMP_PROJECT_DOC, sendTelemetryEvent,
//     sendTelemetryException,
//     getMessageObject
// } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS, MESSAGES, PROJECT_TYPE, PALETTE_COMMANDS } from "./cmd-runner";
import { getCurrentBallerinaProject } from "../../../utils/project-utils";

function activateDocCommand() {
    // register ballerina doc handler
    commands.registerCommand(PALETTE_COMMANDS.DOC, async () => {
        try {
           // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_PROJECT_DOC, CMP_PROJECT_DOC);

            if (window.activeTextEditor && window.activeTextEditor.document.languageId != LANGUAGE.BALLERINA) {
                window.showErrorMessage(MESSAGES.NOT_IN_PROJECT);
                return;
            }

            const currentProject = await ballerinaExtInstance.getDocumentContext().isActiveDiagram() ? await
                getCurrentBallerinaProject(ballerinaExtInstance.getDocumentContext().getLatestDocument()?.toString())
                : await getCurrentBallerinaProject();
            if (currentProject.kind === PROJECT_TYPE.SINGLE_FILE) {
             //   sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_ERROR_EXECUTE_PROJECT_DOC, CMP_PROJECT_DOC,
               //     getMessageObject(MESSAGES.NOT_IN_PROJECT));
                window.showErrorMessage(MESSAGES.NOT_IN_PROJECT);
                return;
            }
            runCommand(currentProject, ballerinaExtInstance.getBallerinaCmd(), BALLERINA_COMMANDS.DOC,
                currentProject.path!);

        } catch (error) {
            if (error instanceof Error) {
              //  sendTelemetryException(ballerinaExtInstance, error, CMP_PROJECT_DOC);
                window.showErrorMessage(error.message);
            } else {
                window.showErrorMessage("Unkown error occurred.");
            }
        }
    });
}

export { activateDocCommand };
