/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { workspace, ExtensionContext, commands, Disposable, window, Uri, debug } from 'vscode';
import { existsSync } from 'fs';
import { sep } from 'path';
import { BallerinaExtension, ExtendedLangClient } from '../../core';
// import {
//     CMP_NOTEBOOK, getMessageObject, sendTelemetryEvent, sendTelemetryException, TM_EVENT_CREATE_NOTEBOOK,
//     TM_EVENT_ERROR_EXECUTE_CREATE_NOTEBOOK, TM_EVENT_OPEN_VARIABLE_VIEW, TM_EVENT_RESTART_NOTEBOOK
// } from '../../features/telemetry';
import { outputChannel } from '../../utils';
import { BallerinaNotebookSerializer } from "./notebookSerializer";
import { BallerinaNotebookController } from "./notebookController";
import { registerLanguageProviders } from './languageProvider';
import { VariableViewProvider } from './variableView';
import {
    BAL_NOTEBOOK, CREATE_NOTEBOOK_COMMAND, DEBUG_NOTEBOOK_COMMAND, NOTEBOOK_TYPE, OPEN_OUTLINE_VIEW_COMMAND,
    OPEN_VARIABLE_VIEW_COMMAND, RESTART_NOTEBOOK_COMMAND, UPDATE_VARIABLE_VIEW_COMMAND
} from './constants';
import { createFile } from './utils';
import { BallerinaDebugAdapterTrackerFactory, NotebookDebuggerController } from './debugger';

const update2RegEx = /^2201.([2-9]|[1-9][0-9]).([0-9]+)/g;
const CLEAR_ALL_CELLS_OUTPUT_COMMAND = 'notebook.clearAllCellsOutputs';
const FOCUS_TO_OUTLINE_COMMAND = 'outline.focus';
const FOCUS_VARIABLE_VIEW_COMMAND = 'ballerinaViewVariables.focus';
const FOCUS_DEBUG_CONSOLE_COMMAND = 'workbench.debug.action.focusRepl';

export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <ExtensionContext>ballerinaExtInstance.context;
    const variableViewProvider = new VariableViewProvider(ballerinaExtInstance);
    const isLSSupported = ballerinaExtInstance.ballerinaVersion.match(update2RegEx);
    const notebookController = new BallerinaNotebookController(ballerinaExtInstance, variableViewProvider, !!isLSSupported);

    context.subscriptions.push(...[
        workspace.registerNotebookSerializer(NOTEBOOK_TYPE, new BallerinaNotebookSerializer()),
        notebookController,
        registerCreateNotebook(ballerinaExtInstance),
        registerFocusToOutline(),
    ]);

    if (!isLSSupported) {
        return;
    }

    context.subscriptions.push(...[
        registerLanguageProviders(ballerinaExtInstance),
        registerVariableView(ballerinaExtInstance),
        registerRefreshVariableView(notebookController),
        registerRestartNotebook(ballerinaExtInstance, notebookController),
        window.registerWebviewViewProvider(VariableViewProvider.viewType, variableViewProvider)
    ]);

    if (ballerinaExtInstance.enabledNotebookDebugMode()) {
        ballerinaExtInstance.setNotebookDebugModeEnabled(true);
        context.subscriptions.push(...[
            registerDebug(new NotebookDebuggerController(ballerinaExtInstance)),
            debug.registerDebugAdapterTrackerFactory('ballerina', new BallerinaDebugAdapterTrackerFactory())
        ]);
    }
}

function registerFocusToOutline(): Disposable {
    return commands.registerCommand(OPEN_OUTLINE_VIEW_COMMAND, () => {
        commands.executeCommand(FOCUS_TO_OUTLINE_COMMAND);
    });
}

function registerVariableView(ballerinaExtInstance: BallerinaExtension): Disposable {
    return commands.registerCommand(OPEN_VARIABLE_VIEW_COMMAND, () => {
       // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_OPEN_VARIABLE_VIEW, CMP_NOTEBOOK);
        ballerinaExtInstance.setNotebookVariableViewEnabled(true);
        commands.executeCommand(FOCUS_VARIABLE_VIEW_COMMAND);
    });
}

function registerRefreshVariableView(notebookController: BallerinaNotebookController): Disposable {
    return commands.registerCommand(UPDATE_VARIABLE_VIEW_COMMAND, () => {
        notebookController.updateVariableView();
    });
}

function registerRestartNotebook(ballerinaExtInstance: BallerinaExtension,
    notebookController: BallerinaNotebookController): Disposable {
    return commands.registerCommand(RESTART_NOTEBOOK_COMMAND, async () => {
        //sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_RESTART_NOTEBOOK, CMP_NOTEBOOK);
        const langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;
        if (!langClient) {
            return;
        }
        await langClient.restartNotebook();
        notebookController.resetController();
        await commands.executeCommand(CLEAR_ALL_CELLS_OUTPUT_COMMAND);
    });
}

function registerCreateNotebook(ballerinaExtInstance: BallerinaExtension): Disposable {
    return commands.registerCommand(CREATE_NOTEBOOK_COMMAND, async () => {
        try {
          //  sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_CREATE_NOTEBOOK, CMP_NOTEBOOK);
            let notebookName = await window.showInputBox({ placeHolder: "new_notebook" });
            if (notebookName && notebookName.trim().length > 0) {
                notebookName = notebookName.endsWith(BAL_NOTEBOOK) ? notebookName : `${notebookName}${BAL_NOTEBOOK}`;
                const uri: Uri = Uri.file(`${workspace.workspaceFolders![0].uri!.fsPath}${sep}${notebookName}`);
                if (!existsSync(uri.fsPath)) {
                    await createFile(uri);
                    commands.executeCommand("vscode.open", uri);
                    outputChannel.appendLine(`${notebookName} created in workspace`);
                } else {
                    const message = `${notebookName} already exists in the workspace.`;
                  //  sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_ERROR_EXECUTE_CREATE_NOTEBOOK,
                    //    CMP_NOTEBOOK, getMessageObject(message));
                    window.showErrorMessage(message);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
              //  sendTelemetryException(ballerinaExtInstance, error, CMP_NOTEBOOK);
                window.showErrorMessage(error.message);
            } else {
                window.showErrorMessage("Unkown error occurred.");
            }
        }
    });
}

function registerDebug(debugController: NotebookDebuggerController): Disposable {
    return commands.registerCommand(DEBUG_NOTEBOOK_COMMAND, (cell) => {
        commands.executeCommand(FOCUS_DEBUG_CONSOLE_COMMAND);
        debugController.startDebugging(cell);
    });
}
