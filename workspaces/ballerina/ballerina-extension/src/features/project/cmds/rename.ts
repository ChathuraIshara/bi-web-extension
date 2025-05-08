/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { commands, Uri, TextDocument, workspace, Position } from "vscode";

const ACTION_POSITIONAL_RENAME_COMMAND = "ballerina.action.positional.rename";

function activateRenameCommand() {
   // Register ballerina rename command that uses line/character based position to rename
    commands.registerCommand(ACTION_POSITIONAL_RENAME_COMMAND, async (url:string, renamePosition:Position) => {
        try {
            const uri: Uri = Uri.parse(url);
            const document: TextDocument = await workspace.openTextDocument(uri);
            if (document === null) {
                return;
            }

            const actionRenamePosition: Position = new Position(renamePosition.line, renamePosition.character);
            await commands.executeCommand('editor.action.rename', [
                document.uri,
                actionRenamePosition,
            ]);
        } catch (error) {
            // do nothing.
        }
    });
}

export { activateRenameCommand };
