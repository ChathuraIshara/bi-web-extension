/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { commands, window } from 'vscode';
import { StateMachine, navigate, openView } from '../stateMachine';
import { COMMANDS } from '../constants';
import { EVENT_TYPE, MACHINE_VIEW } from '@wso2-enterprise/mi-core';
import { extension } from '../MIExtensionContext';
import { importCapp } from '../util/importCapp';
import { SELECTED_SERVER_PATH } from '../debugger/constants';

export function activateVisualizer(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMANDS.OPEN_PROJECT, () => {
            window.showOpenDialog({ canSelectFolders: true, canSelectFiles: true, filters: { 'CAPP': ['car', 'zip'] }, openLabel: 'Open MI Project' })
                .then(uri => {
                    if (uri && uri[0]) {
                        if (uri[0].fsPath.endsWith('.car') || uri[0].fsPath.endsWith('.zip')) {
                            window.showInformationMessage('A car file (CAPP) is selected.\n Do you want to extract it?', { modal: true }, 'Extract')
                                .then(option => {
                                    if (option === 'Extract') {
                                        window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, title: 'Select the location to extract the CAPP', openLabel: 'Select Folder' })
                                            .then(extractUri => {
                                                if (extractUri && extractUri[0]) {
                                                    importCapp({ source: uri[0].fsPath, directory: extractUri[0].fsPath, open: false });
                                                }
                                            });
                                    }
                                });
                        } else {
                            commands.executeCommand('vscode.openFolder', uri[0]);
                        }
                    }
                });
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMANDS.IMPORT_CAPP, () => {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.ImportProjectForm });
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMANDS.OPEN_WELCOME, () => {
            openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Welcome });
        })
    );
    // Activate editor/title items
    context.subscriptions.push(
        commands.registerCommand(COMMANDS.SHOW_GRAPHICAL_VIEW, async (file: vscode.Uri | string) => {
            if (typeof file !== 'string') {
                file = file.fsPath;
            }
            navigate({ location: { view: null, documentUri: file } });
        })
    );

    context.subscriptions.push(
        commands.registerCommand(COMMANDS.SHOW_OVERVIEW, async () => {
            const projectType: string | undefined = extension.context.workspaceState.get('projectType');
            switch (projectType) {
                case 'miProject':
                    openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.Overview });
                    break;
                case 'oldProject':
                    const displayState: boolean | undefined = extension.context.workspaceState.get('displayOverview');
                    const displayOverview = displayState === undefined ? true : displayState;
                    openView(EVENT_TYPE.OPEN_VIEW, { view: MACHINE_VIEW.UnsupportedProject, customProps: { displayOverview } });
                    break;
            }
        })
    );

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            // Check if the specific configuration key changed
            if (event.affectsConfiguration('MI.' + SELECTED_SERVER_PATH)) {
                // Show a prompt to restart the window
                vscode.window
                    .showInformationMessage(
                        'The workspace setting has changed. A window reload is required for changes to take effect.',
                        'Reload Window'
                    )
                    .then((selectedAction) => {
                        if (selectedAction === 'Reload Window') {
                            // Command to reload the window
                            vscode.commands.executeCommand('workbench.action.reloadWindow');
                        }
                    });
            }
        })
    );

    // Listen for pom changes and update dependencies
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            if (event.document.uri.fsPath.endsWith('pom.xml')) {
                const langClient = StateMachine.context().langClient;
                const confirmUpdate = await vscode.window.showInformationMessage(
                    'The pom.xml file has been modified. Do you want to update the dependencies?',
                    'Yes',
                    'No'
                );

                if (confirmUpdate === 'Yes') {
                    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
                    statusBarItem.text = '$(sync) Updating dependencies...';
                    statusBarItem.show();
                    await langClient?.updateConnectorDependencies();
                    statusBarItem.hide();
                }
            }
        })
    );

    StateMachine.service().onTransition((state) => {
        if (state.event.viewLocation?.view) {
            const documentUri = state.event.viewLocation?.documentUri?.toLowerCase();
            commands.executeCommand('setContext', 'showGoToSource', documentUri?.endsWith('.xml') || documentUri?.endsWith('.ts') || documentUri?.endsWith('.dbs'));
        }
    });
}
