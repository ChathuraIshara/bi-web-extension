/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { PALETTE_COMMANDS } from '../../features/project/cmds/cmd-runner';
import { StateMachine, openView } from '../../stateMachine';
import { extension } from '../../BalExtensionContext';
import { BI_COMMANDS, EVENT_TYPE, MACHINE_VIEW, SHARED_COMMANDS } from '@wso2-enterprise/ballerina-core';
import { ViewColumn } from 'vscode';
import { forceUpdateProjectArtifacts } from '../../utils/project-artifacts';

export function activateSubscriptions() {
    const context = extension.context;
    context.subscriptions.push(
        vscode.commands.registerCommand(PALETTE_COMMANDS.SHOW_SOURCE, () => {
            let path = StateMachine.context().documentUri;
            if(extension.isWebMode && !path.startsWith("web-bala:"))
            {
                 path = `web-bala:${path}`;
            }
            if (!path) {
                return;
            }
            vscode.window.showTextDocument(extension.isWebMode?vscode.Uri.parse(path):vscode.Uri.file(path), { viewColumn: ViewColumn.Beside });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(PALETTE_COMMANDS.SHOW_ENTITY_DIAGRAM, (path, selectedRecord = "") => {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ERDiagram, documentUri: path?.fsPath || vscode.window.activeTextEditor.document.uri.fsPath, identifier: selectedRecord });
        })
    );


    // <------------- Shared Commands ------------>
    context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.SHOW_VISUALIZER, (path: string | vscode.Uri, position, resetHistory = false) => {
            console.log("path in the command",path);
            console.log("is bi supported", StateMachine.context().isBISupported);
            const documentPath = path ? (typeof path === "string" ? path : path.fsPath) : "web-bala:/ChathuraIshara/post-intergration";
            const tempPosition = position? position:{groupId:0};
            console.log("documentPath", documentPath);
           // console.log("path.tostring()", path.toString());
            console.log("vscode.window.activeTextEditor?.document.uri.fsPath",vscode.window.activeTextEditor?.document.uri.fsPath);
            if (StateMachine.langClient()) { // This is added since we can't fetch new diagram data without bi supported ballerina version
                openView(EVENT_TYPE.OPEN_VIEW, { documentUri:extension.isWebMode?(path?path.toString():documentPath.toString()):(documentPath || vscode.window.activeTextEditor?.document.uri.fsPath), position:position?position:tempPosition }, resetHistory);
            } else {
                openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BallerinaUpdateView }); // Redirect user to the ballerina update available page
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.GET_STATE_CONTEXT, () => {
            return StateMachine.context();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.FORCE_UPDATE_PROJECT_ARTIFACTS, () => {
            return forceUpdateProjectArtifacts();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.OPEN_BI_WELCOME, () => {
            if (StateMachine.langClient()) {
                openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BIWelcome });
            } else {
                openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.SetupView });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(SHARED_COMMANDS.OPEN_BI_NEW_PROJECT, () => {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.BIProjectForm });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(BI_COMMANDS.OPEN_TYPE_DIAGRAM, () => {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.TypeDiagram });
        })
    );


    StateMachine.service().onTransition((state) => {
        vscode.commands.executeCommand('setContext', 'showBalGoToSource', state.context?.documentUri !== undefined);
    });

}
