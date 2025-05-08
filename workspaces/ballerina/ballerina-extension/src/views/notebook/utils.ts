/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CompletionItemKind as MonacoCompletionItemKind } from "monaco-languageclient";
import { CompletionItemKind as VSCodeCompletionItemKind, Uri, workspace } from "vscode";
import { TextEncoder } from "util";
import { isInDefinedVariables } from "./notebookController";

export interface CompletionResponse {
    detail: string;
    insertText: string;
    insertTextFormat: number;
    kind: number;
    label: string;
    documentation?: string;
    sortText?: string;
}

const QUOTE = "'";

function getPlainTextSnippet(snippet: string) {
    return snippet.replace(/\${\d+(:\S+)*}/g, "");
}

function getReplacedInsertedText(text: string) {
    return text.replace(/\\\\/g, "\\");
}

function isVariableWithQuote(completionResponse: CompletionResponse) {
    const insertText = getReplacedInsertedText(completionResponse.insertText);
    return (
        completionResponse.kind === 6 &&
        insertText.startsWith(QUOTE) &&
        !isInDefinedVariables(insertText)
    );
}

export function getInsertText(completionResponse: CompletionResponse) {
    const insertText = getReplacedInsertedText(completionResponse.insertText);
    if (isVariableWithQuote(completionResponse)) {
        return getPlainTextSnippet(insertText.substring(1));
    }
    return getPlainTextSnippet(insertText);
}

export function getLabel(completionResponse: CompletionResponse) {
    if (isVariableWithQuote(completionResponse)) {
        return completionResponse.label.substring(1);
    }
    return completionResponse.label;
}

export function translateCompletionItemKind(kind: MonacoCompletionItemKind) {
    return (kind - 1) as VSCodeCompletionItemKind;
}

export function filterCompletions(completions: CompletionResponse[]): CompletionResponse[] {
    const labelsUsedInShell = [
        "__last__",
        "__java_recall(handle context_id, handle name)",
        "__memorize(string name, any|error value)",
        "main()",
        "init()",
        "__run()",
        "__recall_any_error(string name)",
        "__recall_any(string name)",
        "__java_memorize(handle context_id, handle name, any|error value)",
        "__stmts()",
    ];
    return completions.filter(
        (item) => !labelsUsedInShell.includes(item.label)
    );
}

export async function createFile(uri: Uri, content?: string) {
    await workspace.fs.writeFile(uri, new TextEncoder().encode(content));
}

export function getSmallerMax(array: number[], goal: number) {
    return array.sort((a, b) => a - b).reverse().find(value => value <= goal);
}
