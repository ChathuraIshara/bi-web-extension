/**
 * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ExtensionContext, commands, window, Location, Uri, TextEditor, extensions, env, UIKind } from 'vscode';
import { ballerinaExtInstance, BallerinaExtension } from './core';
import { activate as activateBBE } from './views/bbe';

// import {
//     activate as activateTelemetryListener, CMP_EXTENSION_CORE, sendTelemetryEvent,
//     TM_EVENT_EXTENSION_ACTIVATE
// } from './features/telemetry';
import { activateDebugConfigProvider } from './features/debugger';
import { activate as activateProjectFeatures } from './features/project';
import { activate as activateEditorSupport } from './features/editor-support';
import { activate as activateTesting } from './features/testing/activator';
import { activate as activateBITesting } from './features/test-explorer/activator';
import { activateEditorSupport as activateWebEditorSupport } from './web-activators/editer-support/activator';
import { StaticFeature, DocumentSelector, ServerCapabilities, InitializeParams, FeatureState } from 'vscode-languageclient';
import { ExtendedLangClient } from './core/extended-language-client';
import { activate as activateNotebook } from './views/notebook';
import { activate as activateLibraryBrowser } from './features/library-browser';
import { activate as activateBIFeatures } from './features/bi';
import { activate as activateERDiagram } from './views/persist-layer-diagram';
import { activateAiPanel } from './views/ai-panel';
import { debug, handleResolveMissingDependencies, log } from './utils';
import { activateUriHandlers } from './utils/uri-handlers';
import { StateMachine } from './stateMachine';
import { activateSubscriptions } from './views/visualizer/activate';
import { extension } from './BalExtensionContext';
import { ExtendedClientCapabilities } from '@wso2-enterprise/ballerina-core';
import { RPCLayer } from './RPCLayer';
import { activateAIFeatures } from './features/ai/activator';
import { activateTryItCommand } from './features/tryit/activator';
import { activate as activateNPFeatures } from './features/natural-programming/activator';
import { activateAgentChatPanel } from './views/agent-chat/activate';

let langClient: ExtendedLangClient;
export let isPluginStartup = true;

// TODO initializations should be contributions from each component
function onBeforeInit(langClient: ExtendedLangClient) {
    class TraceLogsFeature implements StaticFeature {
        preInitialize?: (capabilities: ServerCapabilities<any>, documentSelector: DocumentSelector) => void;
        getState(): FeatureState {
            throw new Error('Method not implemented.');
        }
        fillInitializeParams?: ((params: InitializeParams) => void) | undefined;
        dispose(): void {
        }
        fillClientCapabilities(capabilities: ExtendedClientCapabilities): void {
            capabilities.experimental = capabilities.experimental || { introspection: false, showTextDocument: false };
            capabilities.experimental.introspection = true;
        }
        initialize(_capabilities: ServerCapabilities, _documentSelector: DocumentSelector | undefined): void {
        }
    }

    class ShowFileFeature implements StaticFeature {
        preInitialize?: (capabilities: ServerCapabilities<any>, documentSelector: DocumentSelector) => void;
        getState(): FeatureState {
            throw new Error('Method not implemented.');
        }
        fillInitializeParams?: ((params: InitializeParams) => void) | undefined;
        dispose(): void {

        }
        fillClientCapabilities(capabilities: ExtendedClientCapabilities): void {
            capabilities.experimental = capabilities.experimental || { introspection: false, showTextDocument: false };
            capabilities.experimental.showTextDocument = true;
        }
        initialize(_capabilities: ServerCapabilities, _documentSelector: DocumentSelector | undefined): void {
        }
    }

    class ExperimentalLanguageFeatures implements StaticFeature {
        getState(): FeatureState {
            throw new Error('Method not implemented.');
        }
        fillInitializeParams?: ((params: InitializeParams) => void) | undefined;
        dispose(): void {
        }
        fillClientCapabilities(capabilities: ExtendedClientCapabilities): void {
            capabilities.experimental = capabilities.experimental || { introspection: false, showTextDocument: false };
            capabilities.experimental.experimentalLanguageFeatures = ballerinaExtInstance.enabledExperimentalFeatures();
        }
        initialize(_capabilities: ServerCapabilities, _documentSelector: DocumentSelector | undefined): void {
        }
    }

    langClient.registerFeature(new TraceLogsFeature());
    langClient.registerFeature(new ShowFileFeature());
    langClient.registerFeature(new ExperimentalLanguageFeatures());
}

export async function activate(context: ExtensionContext) {
    extension.context = context;
   // console.log('extension path',ballerinaExtInstance.context.extensionPath);
    
    extension.isWebMode = env.uiKind === UIKind.Web?true:false; // Indicates if the extension is running in web mode
    // Init RPC Layer methods
    RPCLayer.init();
    // Wait for the ballerina extension to be ready
    await StateMachine.initialize();
  
    // Then return the ballerina extension context
    return { ballerinaExtInstance, projectPath: StateMachine.context().projectUri };
}

export async function activateBallerina(): Promise<BallerinaExtension> {
    debug('Active the Ballerina VS Code extension.');
   // sendTelemetryEvent(ballerinaExtInstance, TM_EVENT_EXTENSION_ACTIVATE, CMP_EXTENSION_CORE);
    ballerinaExtInstance.setContext(extension.context);
    // Enable URI handlers
    activateUriHandlers(ballerinaExtInstance);
    // Activate Subscription Commands
    activateSubscriptions();
    await ballerinaExtInstance.init(onBeforeInit).then(() => {
        // <------------ CORE FUNCTIONS ----------->
        // Activate Library Browser
        activateLibraryBrowser(ballerinaExtInstance);

        // Enable Ballerina Project related features
        activateProjectFeatures();

        // Enable Ballerina Debug Config Provider
        activateDebugConfigProvider(ballerinaExtInstance);

        // Activate editor support
        if(extension.isWebMode)
        {
           activateWebEditorSupport(ballerinaExtInstance);
        }
        else{
            activateEditorSupport(ballerinaExtInstance);
        }
        // <------------ MAIN FEATURES ----------->
        // Enable Ballerina by examples
        activateBBE(ballerinaExtInstance);

        //Enable BI Feature
        activateBIFeatures(ballerinaExtInstance);

        // Enable Ballerina Testing Explorer
        activateBITesting(ballerinaExtInstance);

        // Enable Ballerina Notebook
        activateNotebook(ballerinaExtInstance);

        // activateDesignDiagramView(ballerinaExtInstance);
        activateERDiagram(ballerinaExtInstance);

        // <------------ OTHER FEATURES ----------->
        // Enable Ballerina Telemetry listener
       // activateTelemetryListener(ballerinaExtInstance);

        //activate ai panel
        activateAiPanel(ballerinaExtInstance);

        // Activate AI features
        activateAIFeatures(ballerinaExtInstance);

        // Activate Try It command
        activateTryItCommand(ballerinaExtInstance);

        // Activate natural programming features
        activateNPFeatures(ballerinaExtInstance);

        // Activate Agent Chat Panel
        activateAgentChatPanel(ballerinaExtInstance);

        langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;
        // Register showTextDocument listener
        langClient.onNotification('window/showTextDocument', (location: Location) => {
            if (location.uri !== undefined) {
                window.showTextDocument(Uri.parse(location.uri.toString()), { selection: location.range });
            }
        });
        isPluginStartup = false;
    }).catch((e) => {
        log("Failed to activate Ballerina extension. " + (e.message ? e.message : e));
        const cmds: any[] = ballerinaExtInstance.extension.packageJSON.contributes.commands;

        // LS Extension fails
        commands.executeCommand('setContext', 'BI.status', 'noLS');

        if (e.message && e.message.includes('Error when checking ballerina version.')) {
            ballerinaExtInstance.showMessageInstallBallerina();
            ballerinaExtInstance.showMissingBallerinaErrInStatusBar();

            // TODO: Fix this properly
            // cmds.forEach((cmd) => {
            //     const cmdID: string = cmd.command;
            //     // This is to skip the command un-registration
            //     if (!(cmdID.includes("ballerina-setup") || cmdID.includes(SHARED_COMMANDS.OPEN_BI_WELCOME))) {
            //         commands.registerCommand(cmdID, () => {
            //             ballerinaExtInstance.showMessageInstallBallerina();
            //         });
            //     }
            // });
        }
        // When plugins fails to start, provide a warning upon each command execution
        else if (!ballerinaExtInstance.langClient) {
            // TODO: Fix this properly
            // cmds.forEach((cmd) => {
            //     const cmdID: string = cmd.command;
            //     // This is to skip the command un-registration
            //     if (!(cmdID.includes("ballerina-setup") || cmdID.includes(SHARED_COMMANDS.OPEN_BI_WELCOME))) {
            //         commands.registerCommand(cmdID, () => {
            //             const actionViewLogs = "View Logs";
            //             window.showWarningMessage("Ballerina extension did not start properly."
            //                 + " Please check extension logs for more info.", actionViewLogs)
            //                 .then((action) => {
            //                     if (action === actionViewLogs) {
            //                         const logs = ballerinaExtInstance.getOutPutChannel();
            //                         if (logs) {
            //                             logs.show();
            //                         }
            //                     }
            //                 });
            //         });
            //     }
            // });
        }
    }).finally(() => {
        if (ballerinaExtInstance.langClient) {
            handleResolveMissingDependencies(ballerinaExtInstance);
        }
    });
    return ballerinaExtInstance;
}

export function deactivate(): Thenable<void> | undefined {
    debug('Deactive the Ballerina VS Code extension.');
    if (!langClient) {
        return;
    }
   // ballerinaExtInstance.telemetryReporter.dispose();
    return langClient.stop();
}
