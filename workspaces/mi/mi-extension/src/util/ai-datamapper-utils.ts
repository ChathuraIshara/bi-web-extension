
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 */
import { MiDiagramRpcManager } from "../rpc-managers/mi-diagram/rpc-manager";
import { MiVisualizerRpcManager } from "../rpc-managers/mi-visualizer/rpc-manager";
import { Project, QuoteKind } from "ts-morph";
import { StateMachine } from "../stateMachine";
import { getSources } from "./dataMapper";

export async function fetchBackendUrl() {
    try {
        let miDiagramRpcManager: MiDiagramRpcManager = new MiDiagramRpcManager();
        const { url } = await miDiagramRpcManager.getBackendRootUrl();
        return url;
        // Do something with backendRootUri
    } catch (error) {
        console.error('Failed to fetch backend URL:', error);
        throw error;
    }
}

export function openSignInView() {
    let miDiagramRpcClient: MiDiagramRpcManager = new MiDiagramRpcManager();
    miDiagramRpcClient.executeCommand({ commands: ["MI.openAiPanel"] })
        .catch(error => {
            console.error('Failed to open sign-in view:', error);
        });
}

// Function to read the TypeScript file which contains the schema interfaces to be mapped
export function readTSFile(): string {
    //sourcePath is the path of the TypeScript file which contains the schema interfaces to be mapped
    const sourcePath = StateMachine.context().dataMapperProps?.filePath;
    // Check if sourcePath is defined
    if (sourcePath) {
        try {
            const [tsFullText, _] = getSources(sourcePath);
            return tsFullText;
        } catch (error) {
            console.error('Failed to read TypeScript file: ', error);
            throw error;
        }
    } else {
        throw new Error("sourcePath is undefined");
    }
}

// Function to remove the mapFunction line from the TypeScript file
export function removeMapFunctionEntry(content: string): string {
    const project = new Project({
        useInMemoryFileSystem: true,
        manipulationSettings: {
            quoteKind: QuoteKind.Single
        }
    });
    // Create a temporary TypeScript file with the content of the source file
    const sourceFile = project.createSourceFile('temp.ts', content);
    // Get the mapFunction from the source file
    const mapFunction = sourceFile.getFunction('mapFunction');
    if (!mapFunction) {
        throw new Error('mapFunction not found in TypeScript file.');
    }
    let functionContent;
    if (mapFunction.getBodyText()) {
        // Get the function body text and remove any leading or trailing whitespace
        functionContent = mapFunction.getBodyText()?.trim();
    }
    else {
        throw new Error('No function body text found for mapFunction in TypeScript file.');
    }
    // Remove the mapFunction line from the source file
    sourceFile.removeText(mapFunction.getPos(), mapFunction.getEnd());
    return functionContent;
}

// Function to make a request to the backend to get the data mapping
export async function makeRequest(url: string, token: string, tsContent: string) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ts_file: tsContent })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    return response.json();
}

function showNotification(message: string, options: string[] = []) {
    let miVisualizerRpcClient: MiVisualizerRpcManager = new MiVisualizerRpcManager();
    miVisualizerRpcClient.retrieveContext({
        key: "showDmLandingMessage",
        contextType: "workspace"
    }).then((response) => {
        if (response.value ?? true) {
            miVisualizerRpcClient.showNotification({
                message: message,
                options: options,
                type: "info",
            }).then((response) => {
                if (response.selection) {
                    miVisualizerRpcClient.updateContext({
                        key: "showDmLandingMessage",
                        value: false,
                        contextType: "workspace"
                    });
                }
            });
        }
    });
}

// Then use it:
export function showMappingEndNotification() {
    const message = "Please note that automated mapping is powered by AI, and mistakes or surprises are inevitable. \n\nIt is recommended to confirm generated mappings using the </> TS file.";
    showNotification(message, ["Don't show this again"]);
}

export function showSignedOutNotification() {
    const message = "Account not found. \n\n Please sign in and try again.";
    showNotification(message);
}
