/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// import {
//     sendTelemetryEvent, sendTelemetryException, TM_EVENT_PASTE_AS_RECORD, CMP_JSON_TO_RECORD,
// } from "../../telemetry";
import { commands, window, env } from "vscode";
import { ballerinaExtInstance, DIAGNOSTIC_SEVERITY } from "../../../core";
import { PALETTE_COMMANDS, MESSAGES } from "./cmd-runner";
import { JsonToRecord } from "@wso2-enterprise/ballerina-core";

const MSG_NOT_SUPPORT = "Paste JSON as a Ballerina record feature is not supported";

export function activatePasteJsonAsRecord() {

    if (!ballerinaExtInstance.langClient) {
        return;
    }

    commands.registerCommand(PALETTE_COMMANDS.PASTE_JSON_AS_RECORD, () => {
        // This command is only available since Swan Lake Beta 2
        // Check the version before registering the command
        const balVersion = ballerinaExtInstance.ballerinaVersion.toLowerCase();
        if (!balVersion.includes("alpha") && !balVersion.includes("preview")) {
            if (balVersion.includes("beta")) {
                // check if SL Beta version >= 2
                const digits = ballerinaExtInstance.ballerinaVersion.replace(/[^0-9]/g, "");
                const versionNumber = +digits;
                if (versionNumber < 2) {
                    window.showErrorMessage(`${MSG_NOT_SUPPORT} in ${ballerinaExtInstance.ballerinaVersion}`);
                    return;
                }
            }
        } else {
            window.showErrorMessage(`${MSG_NOT_SUPPORT} in ${ballerinaExtInstance.ballerinaVersion}`);
            return;
        }
        if (!window.activeTextEditor || !window.activeTextEditor?.document.fileName.endsWith('.bal')) {
            window.showErrorMessage("Target is not a Ballerina file!");
            return;
        }
       // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_PASTE_AS_RECORD, CMP_JSON_TO_RECORD);
        env.clipboard.readText()
            .then(clipboardText => {
                if (!ballerinaExtInstance.langClient) {
                    window.showErrorMessage("Ballerina language client not found.");
                    return;
                }
                ballerinaExtInstance.langClient!.convertJsonToRecord({ jsonString: clipboardText, isClosed: false, isRecordTypeDesc: false, recordName: "", forceFormatRecordFields: false })
                    .then(lSResponse => {
                        const response = lSResponse as JsonToRecord;
                        if (!response) {
                            window.showErrorMessage(MESSAGES.INVALID_JSON_RESPONSE);
                            return;
                        }
                        // Check undefined diagnostics for when older SDK is used which does not send diagnostics in response.
                        if (response.diagnostics === undefined && (response.codeBlock === undefined || response.codeBlock === "")) {
                            window.showErrorMessage(MESSAGES.INVALID_JSON);
                            return;
                        }
                        if (response.diagnostics !== undefined) {
                            for (const diagnostic of response.diagnostics) {
                                if (diagnostic.severity === undefined || diagnostic.severity === DIAGNOSTIC_SEVERITY.ERROR) {
                                    window.showErrorMessage(diagnostic.message);
                                } else if (diagnostic.severity === DIAGNOSTIC_SEVERITY.WARNING) {
                                    window.showWarningMessage(diagnostic.message);
                                } else {
                                    window.showInformationMessage(diagnostic.message);
                                }
                            }
                        }
                        const editor = window.activeTextEditor;
                        editor?.edit(editBuilder => {
                            if (editor.selection.isEmpty) {
                                const startPosition = editor.selection.active;
                                editBuilder.insert(startPosition, response.codeBlock);
                            } else {
                                editBuilder.replace(editor.selection, response.codeBlock);
                            }
                        });
                    },
                        error => {
                            window.showErrorMessage(error.message);
                         //   sendTelemetryException(ballerinaExtInstance, error, CMP_JSON_TO_RECORD);
                        });
            },
                error => {
                    window.showErrorMessage(error.message);
                  //  sendTelemetryException(ballerinaExtInstance, error, CMP_JSON_TO_RECORD);
                });
    });
}
