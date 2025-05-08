/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { assert, expect } from "chai";
import { TextDecoder } from "util";
import { commands, NotebookCell, NotebookDocument, Uri, window, workspace } from "vscode";

/* Ballerina notebook extension */
export const BAL_NOTEBOOK = ".balnotebook";

/* Notebook type */
export const NOTEBOOK_TYPE = "ballerina-notebook";

export const openNotebook = async (balnotebook: string) => {
    const uri = Uri.file(balnotebook);
    await commands.executeCommand("vscode.openWith", uri, NOTEBOOK_TYPE);
    const notebookDoc = await workspace.openNotebookDocument(uri);
    return notebookDoc;
}

export const saveActiveNotebook = async () => {
    await commands.executeCommand('workbench.action.files.saveAll');
}

export const closeActiveWindows = async () => {
    if (!window.visibleTextEditors) {
        void commands.executeCommand('workbench.action.closeAllEditors');
        return;
    }
}

export const runAllCellsInActiveNotebook = async (notebookDocument: NotebookDocument, waitForExecutionToComplete = false) => {
    if (!notebookDocument || !notebookDocument.uri) {
        throw new Error('No editor or document');
    }

    const promise = commands
        .executeCommand('notebook.execute', notebookDocument.uri)
        .then(noop, noop);

    if (waitForExecutionToComplete) {
        await promise.then(noop, noop);
    }
}

export const noop = () => { }

export const assertHasTextOutputInVSCode = (cell: NotebookCell, text: string) => {
    assert.ok(cell.outputs.length, 'No output');
    const result = cell.outputs.some(output => output.items.some((item) =>
        item.mime === 'text/plain' && (new TextDecoder().decode(item.data) === text)));
    assert.isTrue(result, `${text} not found in outputs of cell ${cell.index + 1}`);
    return result;
}

export const assertContainsMimeTypes = (cell: NotebookCell, mimeTypes: string[]) => {
    let mimesInCell = new Set();
    for (const output of cell.outputs) {
        for (const item of output.items) {
            mimesInCell.add(item.mime);
        }
    }
    for (const mime of [...mimesInCell]) {
        expect(mimeTypes).to.include(mime);
    }
}
