/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import { workspace } from 'vscode';
import { Uri, Position } from 'vscode';
import { LinePosition } from '@wso2-enterprise/ballerina-core';
import path from 'path';

export async function injectImportIfMissing(importStatement: string, filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (!fileContent.includes(importStatement)) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        const position = new vscode.Position(0, 0); // Insert at the beginning of the file
        workspaceEdit.insert(vscode.Uri.file(filePath), position, importStatement + ';\n');
        await vscode.workspace.applyEdit(workspaceEdit);
    }
}

export async function injectAgent(name: string, projectUri: string) {
    const agentCode = `
final ai:OpenAiProvider _${name}Model = check new ("", ai:GPT_4O);
final ai:Agent _${name}Agent = check new (systemPrompt = {role: "", instructions: string \`\`},
    model = _${name}Model,
    tools = []
);`;
    // Update the service function code 
    const agentsFile = path.join(projectUri, `agents.bal`);
    const agentEdit = new vscode.WorkspaceEdit();

    // Read the file content to determine its length
    let fileContent = '';
    try {
        fileContent = fs.readFileSync(agentsFile, 'utf8');
    } catch (error) {
        // File doesn't exist, that's fine - we'll create it
    }

    // Insert at the end of the file
    agentEdit.insert(Uri.file(agentsFile), new Position(fileContent.split('\n').length, 0), agentCode);
    await workspace.applyEdit(agentEdit);
}


export async function injectAgentCode(name: string, serviceFile: string, injectionPosition: LinePosition) {
    // Update the service function code 
    const serviceEdit = new vscode.WorkspaceEdit();
    const serviceSourceCode = `
        string stringResult = check _${name}Agent->run(request.message, request.sessionId);
        return {message: stringResult};
`;
    serviceEdit.insert(Uri.file(serviceFile), new Position(injectionPosition.line, 0), serviceSourceCode);
    await workspace.applyEdit(serviceEdit);
}
