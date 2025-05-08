/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from "vscode";
import { ext } from "./fhirToolsExtentionContext";
import { activateCommands } from "./activateCommands";
import { checkDocumentContext } from "./utils";
import { Logger } from "./logger/logger";
import { listenToConfigurationChanges } from "./constants/config";

export function activate(context: vscode.ExtensionContext) {
  Logger.init(context);
  ext.context = context;

  checkDocumentContext(
    vscode.window.activeTextEditor?.document.getText(),
    vscode.window.activeTextEditor?.document.fileName
  );

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      checkDocumentContext(
        editor?.document.getText(),
        editor?.document.fileName
      );
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidSaveTextDocument(
    (event) => {
      checkDocumentContext(event.getText(), event.fileName);
    },
    null,
    context.subscriptions
  );

  activateCommands(context);
  listenToConfigurationChanges();

}

export function deactivate() {}
