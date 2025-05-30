/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from "vscode";
import * as path from "path";
import { Uri, ViewColumn, Webview } from "vscode";
import { RPCLayer } from "../../RPCLayer";
import { debounce } from "lodash";
import { WebViewOptions, getComposerWebViewOptions, getLibraryWebViewContent } from "../../utils/webview-utils";
import { extension } from "../../BalExtensionContext";
import { StateMachine, updateView } from "../../stateMachine";
import { LANGUAGE } from "../../core";


export class VisualizerWebview {
    public static currentPanel: VisualizerWebview | undefined;
    public static readonly viewType = "ballerina.visualizer";
    public static readonly ballerinaTitle = "Ballerina Visualizer";
    public static readonly biTitle = "Ballerina Integrator";
    private _panel: vscode.WebviewPanel | undefined;
    private _disposables: vscode.Disposable[] = [];

    constructor() {
        this._panel = VisualizerWebview.createWebview();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this.getWebviewContent(this._panel.webview);
        RPCLayer.create(this._panel);

        // Handle the text change and diagram update with rpc notification
        const sendUpdateNotificationToWebview = debounce(async (refreshTreeView?: boolean) => {
            if (this._panel) {
                updateView(refreshTreeView);
            }
        }, 500);

        vscode.workspace.onDidChangeTextDocument(async (document) => {
            await document.document.save();
            const state = StateMachine.state();
            const machineReady = typeof state === 'object' && 'viewActive' in state && state.viewActive === "viewReady";
            if (this._panel?.active && machineReady && document && document.document.languageId === LANGUAGE.BALLERINA) {
                sendUpdateNotificationToWebview();
            }
        }, extension.context);

        vscode.workspace.onDidDeleteFiles(() => {
            sendUpdateNotificationToWebview();
        });

        this._panel.onDidChangeViewState(() => {
            vscode.commands.executeCommand('setContext', 'isBalVisualizerActive', this._panel?.active);
            // Refresh the webview when becomes active
            const state = StateMachine.state();
            const machineReady = typeof state === 'object' && 'viewActive' in state && state.viewActive === "viewReady";
            if (this._panel?.active && machineReady) {
                sendUpdateNotificationToWebview(true);
            }
        });

        this._panel.onDidDispose(() => {
            vscode.commands.executeCommand('setContext', 'isBalVisualizerActive', false);
        });
    }

    public static get webviewTitle(): string {
        // If running in web mode, always use biTitle
        if (extension.isWebMode) {
            return VisualizerWebview.biTitle;
        }
        // Otherwise, check for the presence of the BI extension
        const biExtension = vscode.extensions.getExtension('wso2.ballerina-integrator');
        return biExtension ? VisualizerWebview.biTitle : VisualizerWebview.ballerinaTitle;
    }

    private static createWebview(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            VisualizerWebview.viewType,
            VisualizerWebview.webviewTitle,
            { viewColumn: ViewColumn.Active, preserveFocus: true },
            {
                enableScripts: true,
                localResourceRoots: [Uri.file(path.join(extension.context.extensionPath, "resources"))],
                retainContextWhenHidden: true,
            }
        );
        // Use BI icons if in web mode, or if BI extension is present in desktop
        const useBiIcons = extension.isWebMode || vscode.extensions.getExtension('wso2.ballerina-integrator');
        panel.iconPath = {
            light: vscode.Uri.joinPath(extension.context.extensionUri, 'resources', 'icons', useBiIcons ? 'light-icon.svg' : 'ballerina.svg'),
            dark: vscode.Uri.joinPath(extension.context.extensionUri, 'resources', 'icons', useBiIcons ? 'dark-icon.svg' : 'ballerina-inverse.svg')
        };
        return panel;
    }

    public getWebview(): vscode.WebviewPanel | undefined {
        console.log("going to return this._panel", this._panel);
        return this._panel;
    }

    private getWebviewContent(webView: Webview) {
        const body = `<div class="container" id="webview-container">
                <div class="loader-wrapper">
                    <div class="loader" /></div>
                </div>
            </div>`;
        const bodyCss = ``;
        const styles = `
            .container {
                background-color: var(--vscode-editor-background);
                height: 100vh;
                width: 100%;
                display: flex;
            }
            .loader-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
            .loader {
                width: 32px;
                aspect-ratio: 1;
                border-radius: 50%;
                border: 4px solid var(--vscode-button-background);
                animation:
                    l20-1 0.8s infinite linear alternate,
                    l20-2 1.6s infinite linear;
            }
            @keyframes l20-1{
                0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
                12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
                25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
                50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
                62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
                75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
                100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
            }
            @keyframes l20-2{ 
                0%    {transform:scaleY(1)  rotate(0deg)}
                49.99%{transform:scaleY(1)  rotate(135deg)}
                50%   {transform:scaleY(-1) rotate(0deg)}
                100%  {transform:scaleY(-1) rotate(-135deg)}
            }
        `;
        const scripts = `
            function loadedScript() {
                function renderDiagrams() {
                    visualizerWebview.renderWebview("visualizer", document.getElementById("webview-container"));
                }
                renderDiagrams();
            }
        `;

        const webViewOptions: WebViewOptions = {
            ...getComposerWebViewOptions("Visualizer", webView),
            body,
            scripts,
            styles,
            bodyCss,
        };

        return getLibraryWebViewContent(webViewOptions, webView);
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
        StateMachine.resetToExtensionReady();
    }
}
