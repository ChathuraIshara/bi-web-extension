/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from "vscode";
import { Logger } from "./logger/logger";
import { INFO_MESSAGES, ERROR_MESSAGES } from "./constants/messages";
import { WebView } from "./WebView/WebView";
import { convertToFHIR } from "./stateMachine";

export function activateCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("fhir-tools.hl7v2tofhir", () => {
      Logger.log({
        type: "INFO",
        message: INFO_MESSAGES.TRIGGERING_HL7V2_TO_FHIR,
      });
      if (vscode.window.activeTextEditor) {
        let hl7v2Data = vscode.window.activeTextEditor.document.getText();
        convertToFHIR(hl7v2Data, "HL7v2", vscode.window.activeTextEditor.document.fileName);
      }
      else{
        Logger.log({
          type: "ERROR",
          message: ERROR_MESSAGES.NO_ACTIVE_DOCUMENT,
        });
        vscode.window.showErrorMessage(ERROR_MESSAGES.NO_ACTIVE_DOCUMENT);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fhir-tools.ccdatofhir", () => {
      Logger.log({
        type: "INFO",
        message: INFO_MESSAGES.TRIGGERING_CDA_TO_FHIR,
      });
      if (vscode.window.activeTextEditor) {
        let cdaData = vscode.window.activeTextEditor.document.getText();
        convertToFHIR(cdaData, "CDA", vscode.window.activeTextEditor.document.fileName);
      }
      else{
        Logger.log({
          type: "ERROR",
          message: ERROR_MESSAGES.NO_ACTIVE_DOCUMENT,
        });
        vscode.window.showErrorMessage(ERROR_MESSAGES.NO_ACTIVE_DOCUMENT);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fhir-tools.copyToClipboard", () => {
      Logger.log({
        type: "INFO",
        message: INFO_MESSAGES.TRIGGERING_COPY_TO_CLIPBOARD,
      });
      let outputData = WebView.getOutputData();
      if (outputData) {
        vscode.env.clipboard.writeText(outputData);
        vscode.window.showInformationMessage("Output copied to clipboard");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fhir-tools.saveToFile", () => {
      Logger.log({
        type: "INFO",
        message: INFO_MESSAGES.TRIGGERING_SAVE_TO_FILE,
      });
      let outputText = WebView.getOutputData();
      if (outputText) {
        const data = new TextEncoder().encode(outputText);
        const outputUri = vscode.window.showSaveDialog({
          filters: {
            JSON: ["json"],
          },
        });
        if (!outputUri) {
          return;
        }
        outputUri.then((uri) => {
          if (uri) {
            vscode.workspace.fs.writeFile(uri, data);
          }
        });
      }
    })
  );
}
