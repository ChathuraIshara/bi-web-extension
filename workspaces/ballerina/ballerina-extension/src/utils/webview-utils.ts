/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Uri, ExtensionContext, WebviewOptions, WebviewPanelOptions, Webview } from "vscode";
import { join, sep } from "path";
import { ballerinaExtInstance } from "../core";

export const RESOURCES_CDN = `https://choreo-shared-codeserver-cdne.azureedge.net/ballerina-low-code-resources@${process.env.BALLERINA_LOW_CODE_RESOURCES_VERSION}`;
const isDevMode = process.env.WEB_VIEW_WATCH_MODE === "true";

function getWebViewResourceRoot(): string {
    console.log("getWebViewResourceRoot", (ballerinaExtInstance.context as ExtensionContext).extensionPath);
    return join((ballerinaExtInstance.context as ExtensionContext).extensionPath,
        'resources');
}

function getNodeModulesRoot(): string {
    console.log("getNodeModulesRoot", (ballerinaExtInstance.context as ExtensionContext).extensionPath);
    return join((ballerinaExtInstance.context as ExtensionContext).extensionPath,
        'node_modules');
}

export function getCommonWebViewOptions(): Partial<WebviewOptions & WebviewPanelOptions> {
    return {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
            Uri.file(join((ballerinaExtInstance.context as ExtensionContext).extensionPath, 'resources', 'jslibs')),
            Uri.file(getWebViewResourceRoot()),
            Uri.file(getNodeModulesRoot())
        ],
    };
}

function getVSCodeResourceURI(filePath: string, webView: Webview): string {
    return webView.asWebviewUri(Uri.file(filePath)).path;
}

export interface WebViewOptions {
    jsFiles?: string[];
    cssFiles?: string[];
    body: string;
    scripts: string;
    styles: string;
    bodyCss?: string;
}

export function getLibraryWebViewContent(options: WebViewOptions, webView: Webview, background: string = "#fff", padding: string = "0px"): string {
    const {
        jsFiles,
        cssFiles,
        body,
        scripts,
        styles,
        bodyCss
    } = options;
    const externalScripts = jsFiles
        ? jsFiles.map(jsFile =>
            '<script charset="UTF-8" onload="loadedScript();" src="' + jsFile + '"></script>').join('\n')
        : '';
    const externalStyles = cssFiles
        ? cssFiles.map(cssFile =>
            '<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').join('\n')
        : '';
    const fontDir = join(getComposerURI(webView), 'font');

    // in windows fontdir path contains \ as separator. css does not like this.
    const fontDirWithSeparatorReplaced = fontDir.split(sep).join("/");

    const isCodeServer = ballerinaExtInstance.getCodeServerContext().codeServerEnv;
    const resourceRoot = isCodeServer ? RESOURCES_CDN : getVSCodeResourceURI(getWebViewResourceRoot(), webView);

    const codiconUri = webView.asWebviewUri(Uri.joinPath((ballerinaExtInstance.context as ExtensionContext).extensionUri, "resources", "codicons", "codicon.css"));
    const fontsUri = webView.asWebviewUri(Uri.joinPath((ballerinaExtInstance.context as ExtensionContext).extensionUri, "node_modules", "@wso2-enterprise", "font-wso2-vscode", "dist", "wso2-vscode.css"));

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="${codiconUri}">
                <link rel="stylesheet" href="${fontsUri}">
                ${externalStyles}
                <style>
                    /* use this class for loader that are shown until the module js is loaded */
                    @font-face {
                        font-family: "Droid Sans Mono";
                        src: url("${fontDirWithSeparatorReplaced}/DroidSansMono.ttf") format("truetype");
                        font-weight: normal;
                        font-style: normal;
                        font-stretch: normal;
                    }
                    html {
                        overflow: hidden;
                    }
                    ${styles}
                </style>
            </head>
            
            <body class="${bodyCss}" style="background: ${background}; padding: ${padding};">
                ${body}
                <script>
                    ${scripts}
                </script>
                <script charset="UTF-8" src="${resourceRoot}/jslibs/webviewCommons.js"></script>
                ${externalScripts}
            </body>
            </html>
        `;
}

function getComposerURI(webView: Webview): string { 
    return getVSCodeResourceURI(join((ballerinaExtInstance.context as ExtensionContext).extensionPath, 'resources',
        'jslibs'), webView);
}

function getComposerCSSFiles(disableComDebug: boolean, devHost: string, webView: Webview): string[] {
    const filePath = join((ballerinaExtInstance.context as ExtensionContext).extensionPath, 'resources', 'jslibs', 'themes', 'ballerina-default.min.css');
    return [
        (isDevMode && !disableComDebug) ? join(devHost, 'themes', 'ballerina-default.min.css')
            : webView.asWebviewUri(Uri.file(filePath)).path
    ];
}

function getComposerJSFiles(componentName: string, disableComDebug: boolean, devHost: string, webView: Webview): string[] {
    const filePath = join((ballerinaExtInstance.context as ExtensionContext).extensionPath, 'resources', 'jslibs') + sep + componentName + '.js';
    return [
        (isDevMode && !disableComDebug) ? join(devHost, componentName + '.js')
            : webView.asWebviewUri(Uri.file(filePath)).path,
        isDevMode ? 'http://localhost:8097' : '' // For React Dev Tools
    ];
}

export function getComposerWebViewOptions(componentName: string, webView: Webview, { disableComDebug = false, devHost = process.env.WEB_VIEW_DEV_HOST as string } = {}): Partial<WebViewOptions> {
    return {
        cssFiles: getComposerCSSFiles(disableComDebug, devHost, webView),
        jsFiles: getComposerJSFiles(componentName, disableComDebug, devHost, webView)
    };
}