/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { CancellationToken, DebugConfiguration, ProviderResult, WorkspaceFolder } from 'vscode';
import { MiDebugAdapter } from './debugAdapter';
import { COMMANDS } from '../constants';
import { extension } from '../MIExtensionContext';
import { executeBuildTask, getServerPath } from './debugHelper';
import { getDockerTask } from './tasks';
import { refreshUI } from '../stateMachine';
import * as fs from 'fs';
import * as path from 'path';
import { SELECTED_SERVER_PATH, SELECTED_JAVA_HOME } from './constants';
import { buildBallerinaModule, setPathsInWorkSpace, verifyJavaHomePath, verifyMIPath } from '../util/onboardingUtils';


class MiConfigurationProvider implements vscode.DebugConfigurationProvider {

    resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {
        // if launch.json is missing or empty
        if (!config.type && !config.request && !config.name) {
            config.type = 'mi';
            config.name = 'MI: Run and Debug';
            config.request = 'launch';
        }

        config.internalConsoleOptions = config.noDebug ? 'neverOpen' : 'openOnSessionStart';

        return config;
    }
}

export function activateDebugger(context: vscode.ExtensionContext) {

    vscode.commands.registerCommand(COMMANDS.BUILD_PROJECT, async (shouldCopyTarget?: boolean, postBuildTask?: Function) => {
        getServerPath().then(async (serverPath) => {
            if (!serverPath) {
                vscode.window.showErrorMessage("Server path not found");
                return;
            }
            await executeBuildTask(serverPath, shouldCopyTarget, postBuildTask);
        });
    });

    vscode.commands.registerCommand(COMMANDS.CREATE_DOCKER_IMAGE, async () => {
        const dockerTask = getDockerTask();
        await vscode.tasks.executeTask(dockerTask);
    });

    // Register command to change the Micro Integrator server path
    vscode.commands.registerCommand(COMMANDS.CHANGE_SERVER_PATH, async () => {
        const addServerOptionLabel = "Add Micro Integrator Server";
        const currentServerPath: string | undefined = extension.context.globalState.get(SELECTED_SERVER_PATH);
        const quickPickItems: vscode.QuickPickItem[] = [];

        if (currentServerPath) {
            quickPickItems.push(
                { kind: vscode.QuickPickItemKind.Separator, label: "Current Server Path" },
                { label: currentServerPath },
                { label: addServerOptionLabel }
            );
        } else {
            quickPickItems.push({ label: addServerOptionLabel });
        }

        const quickPickOptions: vscode.QuickPickOptions = {
            canPickMany: false,
            title: "Select Micro Integrator Server Path",
            placeHolder: currentServerPath ? `Selected Server: ${currentServerPath}` : "Add Micro Integrator Server",
        };

        const selected = await vscode.window.showQuickPick(quickPickItems, quickPickOptions);
        if (selected) {
            let selectedServerPath = '';
            if (selected.label === addServerOptionLabel) {
                // Open folder selection dialog
                const folders = await vscode.window.showOpenDialog({
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: 'Select Folder',
                });

                if (!folders || folders.length === 0) {
                    vscode.window.showErrorMessage('No folder was selected.');
                    return false;
                }

                selectedServerPath = folders[0].fsPath;
            } else {
                selectedServerPath = selected.label;
            }
            const verifiedServerPath = verifyMIPath(selectedServerPath);
            if (verifiedServerPath) {
                await extension.context.globalState.update(SELECTED_SERVER_PATH, verifiedServerPath);
                await setPathsInWorkSpace({ type: 'MI', path: verifiedServerPath });
                return true;
            } else {
                vscode.window.showErrorMessage('Invalid Micro Integrator Server path or unsupported Micro Integrator version.');
                return false;
            }
        }
        return false;
    });

    // Register command to change the Java Home path
    vscode.commands.registerCommand(COMMANDS.CHANGE_JAVA_HOME, async () => {
        try {
            const setJavaOptionLabel = "Set Java Home Path";
            const currentJavaHomePath: string | undefined = extension.context.globalState.get(SELECTED_JAVA_HOME);
            const quickPickItems: vscode.QuickPickItem[] = [];
            if (currentJavaHomePath) {
                quickPickItems.push(
                    { kind: vscode.QuickPickItemKind.Separator, label: "Current Java Home Path" },
                    { label: currentJavaHomePath },
                    { label: setJavaOptionLabel }
                );
            } else {
                quickPickItems.push({ label: setJavaOptionLabel });
            }
            const environmentJavaHome = process.env.JAVA_HOME;
            if (environmentJavaHome) {
                quickPickItems.push(
                    { kind: vscode.QuickPickItemKind.Separator, label: "Environment Java Home" },
                    { label: environmentJavaHome }
                );
            }

            const quickPickOptions: vscode.QuickPickOptions = {
                canPickMany: false,
                title: "Select Java Home Path",
                placeHolder: currentJavaHomePath ? `Selected Java Home: ${currentJavaHomePath}` : "Set Java Home Path",
            };

            const selected = await vscode.window.showQuickPick(quickPickItems, quickPickOptions);
            if (selected) {
                let selectedJavaHomePath = '';
                if (selected.label === setJavaOptionLabel) {
                    // Open folder selection dialog
                    const folders = await vscode.window.showOpenDialog({
                        canSelectFiles: false,
                        canSelectFolders: true,
                        canSelectMany: false,
                        openLabel: 'Select Folder',
                    });

                    if (!folders || folders.length === 0) {
                        vscode.window.showErrorMessage('No folder was selected.');
                        return false;
                    }

                    selectedJavaHomePath = folders[0].fsPath;
                } else {
                    selectedJavaHomePath = selected.label;
                }

                const verifiedJavaHomePath = verifyJavaHomePath(selectedJavaHomePath);
                if (verifiedJavaHomePath) {
                    await extension.context.globalState.update(SELECTED_JAVA_HOME, verifiedJavaHomePath);
                    await setPathsInWorkSpace({ type: 'JAVA', path: verifiedJavaHomePath });
                    return true;
                } else {
                    vscode.window.showErrorMessage('Invalid Java Home path or unsupported Java version. Java 11 or later is required.');
                    return false;
                }
            }
            return false;
        } catch (error) {
            vscode.window.showErrorMessage(
                `Error occurred while setting Java Home path: ${error instanceof Error ? error.message : error}`
            );
            return false;
        }
    });


    context.subscriptions.push(vscode.commands.registerCommand(COMMANDS.BUILD_AND_RUN_PROJECT, async () => {

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        if (workspaceFolder) {
            const launchJsonPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'launch.json');
            const envPath = path.join(workspaceFolder.uri.fsPath, '.env');
            let config: vscode.DebugConfiguration | undefined = undefined;

            if (fs.existsSync(launchJsonPath)) {
                // Read the configurations from launch.json
                const configurations = vscode.workspace.getConfiguration('launch', workspaceFolder.uri);
                const allConfigs = configurations.get<vscode.DebugConfiguration[]>('configurations');

                if (allConfigs) {
                    config = allConfigs.find(c => c.name === 'MI: Run and Debug') || allConfigs[0];
                }
            }

            if (config === undefined) {
                // Default configuration if no launch.json or no matching config
                config = {
                    type: 'mi',
                    name: 'MI: Run',
                    request: 'launch',
                    noDebug: true,
                    internalConsoleOptions: 'neverOpen'
                };
            } else {
                config.name = 'MI: Run';
                config.noDebug = true;
                config.internalConsoleOptions = 'neverOpen';
            }

            if (fs.existsSync(envPath)) {
                const envFileContent = fs.readFileSync(envPath, 'utf-8');
                const envVariables = envFileContent.split('\n').reduce((acc, line) => {
                    const [key, value] = line.split('=').map(part => part.trim());
                    if (key && value) {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as { [key: string]: string });

                // Adding env variables
                config.env = { ...config.env, ...envVariables };
            }

            try {
                await vscode.debug.startDebugging(undefined, config);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to run without debugging: ${err}`);
            }
        } else {
            vscode.window.showErrorMessage('No workspace folder found');
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand(COMMANDS.BUILD_BAL_MODULE, async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const filePath = editor.document.uri.fsPath;
        await buildBallerinaModule(path.dirname(filePath));
    }));


    // register a configuration provider for 'mi' debug type
    const provider = new MiConfigurationProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('mi', provider));

    // register a dynamic configuration provider for 'mi' debug type
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('mi', {
        provideDebugConfigurations(folder: WorkspaceFolder | undefined): ProviderResult<DebugConfiguration[]> {
            return [
                {
                    name: "MI: Run and Debug",
                    request: "launch",
                    type: "mi"
                }
            ];
        }
    }, vscode.DebugConfigurationProviderTriggerKind.Dynamic));

    // Listener to support reflect breakpoint changes in diagram when debugger is inactive
    context.subscriptions.push(vscode.debug.onDidChangeBreakpoints((session) => {
        refreshUI();
    }));

    const factory = new InlineDebugAdapterFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('mi', factory));
}

class InlineDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {

    createDebugAdapterDescriptor(_session: vscode.DebugSession): ProviderResult<vscode.DebugAdapterDescriptor> {
        return new vscode.DebugAdapterInlineImplementation(new MiDebugAdapter());
    }
}
