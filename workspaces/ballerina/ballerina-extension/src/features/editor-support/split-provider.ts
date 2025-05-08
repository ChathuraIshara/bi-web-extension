/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BallerinaExtension } from "../../core";
import { Disposable, Position, Range, TextDocumentChangeEvent, TextDocumentContentChangeEvent, window, workspace } from "vscode";
// import { CMP_STRING_SPLIT, sendTelemetryEvent, TM_EVENT_STRING_SPLIT } from "../telemetry";
import { isWindows } from "../../utils";
import { traversNode } from "@wso2-enterprise/syntax-tree";
import { SplitProviderVisitor } from "./split-provider-visitor";
import { SyntaxTree, SyntaxTreeNode } from "@wso2-enterprise/ballerina-core";

export const newLine: string = isWindows() ? '\r\n' : '\n';
const STRING_LITERAL: string = 'STRING_LITERAL';
const WHITESPACE: string = 'WHITESPACE_MINUTIAE';

/**
 * Provides string split capablity upon new line event.
 */
export class StringSplitter {

    public async updateDocument(event: TextDocumentChangeEvent) {
        const editor = window.activeTextEditor;
        if (!editor || !editor.document.fileName.endsWith('.bal') || event.contentChanges.length === 0 ||
            event.document.fileName.includes("extension-output-wso2.ballerina")) {
            return;
        }
        if (this instanceof BallerinaExtension) {
            // Add change for diagram edit callback
            this.getDocumentContext().didEditorChange({
                fileUri: editor.document.uri,
                startLine: editor.selection.active.line,
                startColumn: editor.selection.active.character
            });

            let documentChange: TextDocumentContentChangeEvent | undefined;
            event.contentChanges.forEach(change => {
                if (change.text.startsWith(newLine)) {
                    documentChange = change;
                }
            });

            if (!documentChange) {
                return;
            }

            const range: Range = documentChange!.range;
            const extension: BallerinaExtension = this;
            if (!this.langClient) {
                return;
            }

            let st = await this.langClient.getSyntaxTree({
                documentIdentifier: {
                    uri: editor.document.uri.toString()
                }
            });
            const visitor = new SplitProviderVisitor(range);

            traversNode((st as SyntaxTree).syntaxTree, visitor, undefined);

            if (!visitor.isValidSplit()) {
                return;
            }

            this.langClient.getSyntaxTreeNode({
                documentIdentifier: {
                    uri: editor.document.uri.toString()
                },
                range: {
                    start: {
                        line: range.start.line,
                        character: range.start.character
                    },
                    end: {
                        line: range.end.line,
                        character: range.end.character
                    }
                }
            }).then((stResponse) => {
                const response = stResponse as SyntaxTreeNode;
                if (!response.kind) {
                    return;
                }
                if (response.kind === WHITESPACE) {
                  //  sendTelemetryEvent(extension, TM_EVENT_STRING_SPLIT, CMP_STRING_SPLIT);
                    editor.edit(editBuilder => {
                        const startPosition = new Position(range.start.line, range.start.character);
                        const nextLinePosition = new Position(range.start.line + 1, documentChange!.text.length - 1);
                        const endPosition = new Position(range.end.line + 1, documentChange!.text.indexOf('\n'));
                        editBuilder.insert(startPosition, `\" +${newLine}`);
                        editBuilder.insert(nextLinePosition, `\"`);
                        editBuilder.delete(new Range(startPosition, endPosition));
                    });
                }
            });
        }
    }
}

/**
 * Configures string split capability for the extension.
 */
export class StringSplitFeature implements Disposable {

    private disposables: Disposable[] = [];
    private provider: StringSplitter;
    private ballerinaExtInstance: BallerinaExtension;

    constructor(provider: StringSplitter, ballerinaExtInstance: BallerinaExtension) {
        this.provider = provider;
        this.ballerinaExtInstance = ballerinaExtInstance;
        workspace.onDidChangeTextDocument(this.provider.updateDocument, this.ballerinaExtInstance, this.disposables);
    }

    dispose() {
        this.disposables.forEach((disposable) => disposable.dispose());
    }
}
