/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 * 
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import * as fs from 'fs';
import path from "path";
import { Uri, workspace } from 'vscode';

import { StateMachine } from "../../stateMachine";

const config = workspace.getConfiguration('ballerina');
export const BACKEND_URL : string = config.get('rootUrl') || "https://dev-tools.wso2.com/ballerina-copilot/v2.0";
export const AUTH_ORG : string = config.get('authOrg') || "ballerinacopilot";
export const AUTH_CLIENT_ID : string = config.get('authClientID') || "9rKng8hSZd0VkeA45Lt4LOfCp9Aa";
export const AUTH_REDIRECT_URL : string = config.get('authRedirectURL') || "https://98c70105-822c-4359-8579-4da58f0ab4b7.e1-us-east-azure.choreoapps.dev";

export async function closeAllBallerinaFiles(dirPath: string): Promise<void> {
    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
        console.error(`Directory does not exist: ${dirPath}`);
        return;
    }

    // Get the language client
    const langClient = StateMachine.langClient();

    // Function to recursively find and close .bal files
    async function processDir(currentPath: string): Promise<void> {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively process subdirectories
                await processDir(entryPath);
            } else if (entry.isFile() && entry.name.endsWith('.bal')) {
                // Convert file path to URI
                const fileUri = Uri.file(entryPath).toString();
                
                // Call didClose for this Ballerina file
                await langClient.didClose({
                    textDocument: { uri: fileUri }
                });
                await langClient.didChangedWatchedFiles({
                    changes: [
                        {
                            uri: fileUri,
                            type: 3
                        }
                    ]
                });

                console.log(`Closed file: ${entryPath}`);
            }
        }
    }

    // Start the recursive processing
    await processDir(dirPath);
}
