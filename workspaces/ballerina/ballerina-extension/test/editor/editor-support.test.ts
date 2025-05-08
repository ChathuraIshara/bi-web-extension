/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { commands, Position, Uri, window } from "vscode";
import { join } from "path";
import { assert } from "chai";

const PROJECT_ROOT = join(__dirname, '..', '..', '..', 'test', 'data');

suite("Editor Tests", function () {
    suiteTeardown((done) => {
        commands.executeCommand('ballerina.stopLangServer');
        done();
    });

    test("Test string splitter", function (done): void {
        const uri = Uri.file(join(PROJECT_ROOT, 'string.bal'));

        commands.executeCommand('vscode.open', uri).then(async () => {
            await wait(15000);
            const editor = window.activeTextEditor;
            editor?.edit(editBuilder => {
                const startPosition: Position = new Position(0, 20);
                editBuilder.insert(startPosition, "\n");

            });
            await wait(5000);
            assert.strictEqual(editor.document.getText(), 'string st = "sample " +\n"giga string";\n', "Invalid string splitter");
            done();
        });
    });

});

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
