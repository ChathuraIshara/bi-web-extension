/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ballerinaExtInstance, LANGUAGE } from "../../../core";
import { commands, window } from "vscode";
// import {
//     CMP_PROJECT_PACK, sendTelemetryEvent, sendTelemetryException, TM_EVENT_PROJECT_PACK
// } from "../../telemetry";
import { runCommand, BALLERINA_COMMANDS, PROJECT_TYPE, PALETTE_COMMANDS, MESSAGES }
    from "./cmd-runner";
import { getCurrentBallerinaProject }
    from "../../../utils/project-utils";

export function activatePackCommand() {
    // register run project build handler
    commands.registerCommand(PALETTE_COMMANDS.PACK, async () => {
        try {
          //  sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_PROJECT_PACK, CMP_PROJECT_PACK);

            if (window.activeTextEditor && window.activeTextEditor.document.languageId != LANGUAGE.BALLERINA) {
                window.showErrorMessage(MESSAGES.NOT_IN_PROJECT);
                return;
            }

            const currentProject = ballerinaExtInstance.getDocumentContext().isActiveDiagram() ? await
                getCurrentBallerinaProject(ballerinaExtInstance.getDocumentContext().getLatestDocument()?.toString())
                : await getCurrentBallerinaProject();
            if (currentProject.kind !== PROJECT_TYPE.SINGLE_FILE) {
                runCommand(currentProject, ballerinaExtInstance.getBallerinaCmd(), BALLERINA_COMMANDS.PACK,
                    currentProject.path!);
            } else {
                window.showErrorMessage(MESSAGES.INVALID_PACK);
            }

        } catch (error) {
            if (error instanceof Error) {
              //  sendTelemetryException(ballerinaExtInstance, error, CMP_PROJECT_PACK);
                window.showErrorMessage(error.message);
            } else {
                window.showErrorMessage("Unkown error occurred.");
            }
        }
    });
}
