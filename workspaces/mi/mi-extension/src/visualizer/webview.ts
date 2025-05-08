/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import {Uri, ViewColumn, workspace} from 'vscode';
import { getComposerJSFiles } from '../util';
import { RPCLayer } from '../RPCLayer';
import { extension } from '../MIExtensionContext';
import { debounce } from 'lodash';
import { refreshUI, StateMachine } from '../stateMachine';
import { MACHINE_VIEW, onDocumentSave } from '@wso2-enterprise/mi-core';
import { COMMANDS, REFRESH_ENABLED_DOCUMENTS, SWAGGER_LANG_ID, SWAGGER_REL_DIR } from '../constants';
import { AiPanelWebview } from '../ai-panel/webview';
import { removeFromHistory } from './../history/activator';
import { deleteSwagger, generateSwagger } from '../util/swagger';

export class VisualizerWebview {
    public static currentPanel: VisualizerWebview | undefined;
    public static readonly viewType = 'micro-integrator.visualizer';
    private _panel: vscode.WebviewPanel | undefined;
    private _disposables: vscode.Disposable[] = [];

    constructor(view: MACHINE_VIEW, beside: boolean = false) {
        this._panel = VisualizerWebview.createWebview(view, beside);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this.getWebviewContent(this._panel.webview);
        RPCLayer.create(this._panel);

        // Handle the text change and diagram update with rpc notification
        const refreshDiagram = debounce(async (refreshDiagram: boolean = true) => {
            if (this.getWebview()) {
                if (!StateMachine.context().isOldProject) {
                    await vscode.commands.executeCommand(COMMANDS.REFRESH_COMMAND); // Refresh the project explore view
                }
                if (refreshDiagram) {
                    refreshUI();
                }
            }
        }, 500);

        vscode.workspace.onDidChangeTextDocument(async function (document) {
            if (!REFRESH_ENABLED_DOCUMENTS.includes(document.document.languageId)) {
                return;
            }
            if (VisualizerWebview.currentPanel?.getWebview()?.active || AiPanelWebview.currentPanel?.getWebview()?.active) {
                await document.document.save();
                if (!StateMachine.context().view?.endsWith('Form')) {
                    refreshDiagram();
                }
            }
        }, extension.context);

        vscode.workspace.onDidDeleteFiles(async function (event) {
            const projectRoot = StateMachine.context().projectUri!;
            refreshDiagram(false);

            const apiDir = path.join(projectRoot, 'src', 'main', "wso2mi", "artifacts", "apis");
            event.files.forEach(file => {
                const filePath = file?.fsPath;
                if (filePath?.includes(apiDir)) {
                    deleteSwagger(filePath);
                }
                removeFromHistory(filePath);
            });
        }, extension.context);

        vscode.workspace.onDidSaveTextDocument(async function (document) {
            const projectUri = StateMachine.context().projectUri!;
            const currentView = StateMachine.context().view;
            if (SWAGGER_LANG_ID === document.languageId) {
                // Check if the saved document is a swagger file
                const relativePath = vscode.workspace.asRelativePath(document.uri);
                if (path.dirname(relativePath) === SWAGGER_REL_DIR) {
                    VisualizerWebview.currentPanel?.getWebview()?.reveal(beside ? ViewColumn.Beside : ViewColumn.Active);
                }
            } else if (!REFRESH_ENABLED_DOCUMENTS.includes(document.languageId)) {
                return;
            }

            const mockServicesDir = path.join(projectUri!, 'src', 'test', 'resources', 'mock-services');
            if (document.uri.toString().includes(mockServicesDir) && currentView == MACHINE_VIEW.TestSuite) {
                return;
            }

            RPCLayer._messenger.sendNotification(
                onDocumentSave,
                { type: 'webview', webviewType: VisualizerWebview.viewType },
                { uri: document.uri.toString() }
            );

            // Generate Swagger file for API files
            const apiDir = path.join(projectUri!, 'src', 'main', "wso2mi", "artifacts", "apis");
            if (document?.uri.fsPath.includes(apiDir)) {
                const workspacePath = workspace.workspaceFolders![0].uri.fsPath;
                const dirPath = path.join(workspacePath, SWAGGER_REL_DIR);
                const swaggerOriginalPath = path.join(dirPath, path.basename(document.uri.fsPath, path.extname(document.uri.fsPath)) + '_original.yaml');
                const swaggerPath = path.join(dirPath, path.basename(document.uri.fsPath, path.extname(document.uri.fsPath)) + '.yaml');
                if (fs.readFileSync(document.uri.fsPath, 'utf-8').split('\n').length > 3) {
                    if (fs.existsSync(swaggerOriginalPath)) {
                        fs.copyFileSync(swaggerOriginalPath, swaggerPath);
                        fs.rmSync(swaggerOriginalPath);
                    } else {
                        generateSwagger(document.uri.fsPath);
                    }
                }
            }

            if (currentView !== 'Connector Store Form') {
                refreshDiagram();
            }
        }, extension.context);

        this._panel.onDidChangeViewState(() => {
            // Enable the Run and Build Project, Open AI Panel commands when the webview is active
            vscode.commands.executeCommand('setContext', 'isVisualizerActive', this._panel?.active);

            if (this._panel?.active && StateMachine.context().view === MACHINE_VIEW.DataMapperView) {
                refreshDiagram();
            }
        });
    }

    private static createWebview(view: MACHINE_VIEW, beside: boolean): vscode.WebviewPanel {
        let title: string;
        switch (view) {
            case MACHINE_VIEW.Overview:
                title = MACHINE_VIEW.Overview;
                break;
            case MACHINE_VIEW.ADD_ARTIFACT:
                title = MACHINE_VIEW.ADD_ARTIFACT;
                break;
            case MACHINE_VIEW.UnsupportedProject:
                title = MACHINE_VIEW.UnsupportedProject;
                break;
            default:
                title = 'Design View';
                break;
        }
        const panel = vscode.window.createWebviewPanel(
            VisualizerWebview.viewType,
            title,
            beside ? ViewColumn.Beside : ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(os.homedir())
                ]
            }
        );
        panel.iconPath = {
            light: Uri.file(path.join(extension.context.extensionPath, 'assets', 'light-icon.svg')),
            dark: Uri.file(path.join(extension.context.extensionPath, 'assets', 'dark-icon.svg'))
        };
        return panel;
    }

    public getWebview(): vscode.WebviewPanel | undefined {
        return this._panel;
    }

    public getIconPath(iconPath: string, name: string): string | undefined {
        const panel = this.getWebview();
        let iconPathUri;

        // Check if PNG file exists
        if (fs.existsSync(path.join(iconPath, name + '.png'))) {
            iconPathUri = vscode.Uri.file(path.join(iconPath, name + '.png').toString());
        } else if (fs.existsSync(path.join(iconPath, name + '.svg'))) {
            // Check for SVG
            iconPathUri = vscode.Uri.file(path.join(iconPath, name + '.svg').toString());
        } else if (fs.existsSync(path.join(iconPath, name + '.gif'))) {
            // Use GIF
            iconPathUri = vscode.Uri.file(path.join(iconPath, name + '.gif').toString());
        } else {
            return undefined;
        }

        if (panel) {
            const iconUri = panel.webview.asWebviewUri(iconPathUri);
            return iconUri.toString();
        }
    }

    private getWebviewContent(webview: vscode.Webview) {
        // The JS file from the React build output
        const scriptUri = getComposerJSFiles(extension.context, 'Visualizer', webview).map(jsFile =>
            '<script charset="UTF-8" src="' + jsFile + '"></script>').join('\n');

        // const codiconUri = webview.asWebviewUri(Uri.joinPath(extension.context.extensionUri, "resources", "codicons", "codicon.css"));
        // const fontsUri = webview.asWebviewUri(Uri.joinPath(extension.context.extensionUri, "node_modules", "@wso2-enterprise", "font-wso2-vscode", "dist", "wso2-vscode.css"));

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <title>Micro Integrator</title>
         
          <style>
            body, html, #root {
                height: 100%;
                margin: 0;
                padding: 0px;
                overflow: hidden;
            }
          </style>
          ${scriptUri}
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">
            </div>
            <script>
            function render() {
                visualizerWebview.renderWebview(
                    document.getElementById("root"), "visualizer"
                );
            }
            render();
        </script>
        </body>
        </html>
      `;
    }

    public dispose() {
        VisualizerWebview.currentPanel = undefined;
        this._panel?.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }

        this._panel = undefined;
    }
}
