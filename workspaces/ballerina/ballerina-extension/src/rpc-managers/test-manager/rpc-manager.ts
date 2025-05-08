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
import {
    AddOrUpdateTestFunctionRequest,
    GetTestFunctionRequest,
    GetTestFunctionResponse,
    STModification,
    SourceUpdateResponse,
    SyntaxTree,
    TestManagerServiceAPI,
    TestSourceEditResponse,
} from "@wso2-enterprise/ballerina-core";
import { ModulePart, NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";
import * as fs from 'fs';
import { existsSync, writeFileSync } from "fs";
import { Uri } from "vscode";
import { StateMachine } from "../../stateMachine";

export class TestServiceManagerRpcManager implements TestManagerServiceAPI {

    async updateTestFunction(params: AddOrUpdateTestFunctionRequest) : Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const targetFile = params.filePath;
                params.filePath = targetFile;
                const targetPosition: NodePosition = {
                    startLine: params.function.codedata.lineRange.startLine.line,
                    startColumn: params.function.codedata.lineRange.startLine.offset
                };
                const res: TestSourceEditResponse = await context.langClient.updateTestFunction(params);
                const position = await this.updateSource(res, undefined, targetPosition);
                const result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });

    }

    async addTestFunction(params: AddOrUpdateTestFunctionRequest) : Promise<SourceUpdateResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const targetFile = params.filePath;
                params.filePath = targetFile;
                const res: TestSourceEditResponse = await context.langClient.addTestFunction(params);
                const position = await this.updateSource(res, undefined);
                const result: SourceUpdateResponse = {
                    filePath: targetFile,
                    position: position
                };
                resolve(result);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async getTestFunction(params: GetTestFunctionRequest) : Promise<GetTestFunctionResponse> {
        return new Promise(async (resolve) => {
            const context = StateMachine.context();
            try {
                const res: GetTestFunctionResponse = await context.langClient.getTestFunction(params);
                resolve(res);
            } catch (error) {
                console.log(error);
            }
        });
    }

    private async updateSource(params: TestSourceEditResponse, identifiers?: string[], targetPosition?: NodePosition): Promise<NodePosition> {
        const modificationRequests: Record<string, { filePath: string; modifications: STModification[] }> = {};
        let position: NodePosition;
        for (const [key, value] of Object.entries(params.textEdits)) {
            const fileUri = Uri.file(key);
            const fileUriString = fileUri.toString();
            if (!existsSync(fileUri.fsPath)) {
                writeFileSync(fileUri.fsPath, '');
            }
            const edits = value;

            if (edits && edits.length > 0) {
                const modificationList: STModification[] = [];

                for (const edit of edits) {
                    const stModification: STModification = {
                        startLine: edit.range.start.line,
                        startColumn: edit.range.start.character,
                        endLine: edit.range.end.line,
                        endColumn: edit.range.end.character,
                        type: "INSERT",
                        isImport: false,
                        config: {
                            STATEMENT: edit.newText,
                        },
                    };
                    modificationList.push(stModification);
                }

                if (modificationRequests[fileUriString]) {
                    modificationRequests[fileUriString].modifications.push(...modificationList);
                } else {
                    modificationRequests[fileUriString] = { filePath: fileUri.fsPath, modifications: modificationList };
                }
            }
        }

        // Iterate through modificationRequests and apply modifications
        try {
            for (const [fileUriString, request] of Object.entries(modificationRequests)) {
                const { parseSuccess, source, syntaxTree } = (await StateMachine.langClient().stModify({
                    documentIdentifier: { uri: fileUriString },
                    astModifications: request.modifications,
                })) as SyntaxTree;

                if (parseSuccess) {
                    (identifiers || targetPosition) && (syntaxTree as ModulePart).members.forEach(member => {
                        if (STKindChecker.isServiceDeclaration(member)) {
                            if (identifiers && identifiers.every(id => id && member.source.includes(id))) {
                                position = member.position;
                            }
                            if (targetPosition && member.position.startLine === targetPosition.startLine && member.position.startColumn === targetPosition.startColumn) {
                                position = member.position;
                            }
                        }
                    });
                    fs.writeFileSync(request.filePath, source);
                    await StateMachine.langClient().didChange({
                        textDocument: { uri: fileUriString, version: 1 },
                        contentChanges: [
                            {
                                text: source,
                            },
                        ],
                    });

                    if (!targetPosition) {
                        await StateMachine.langClient().resolveMissingDependencies({
                            documentIdentifier: { uri: fileUriString },
                        });
                    }
                    // // Temp fix: ResolveMissingDependencies does not work uless we call didOpen, This needs to be fixed in the LS
                    // await StateMachine.langClient().didOpen({
                    //     textDocument: { uri: fileUriString, languageId: "ballerina", version: 1, text: source },
                    // });
                }
            }
        } catch (error) {
            console.log(">>> error updating source", error);
        }
        return position;
    }
}
