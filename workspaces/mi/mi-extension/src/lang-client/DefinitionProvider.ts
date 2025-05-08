/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as vscode from 'vscode';
import { ExtendedLanguageClient } from './ExtendedLanguageClient';

export class GoToDefinitionProvider implements vscode.DefinitionProvider {
    constructor(private langClient: ExtendedLanguageClient) { }

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Thenable<vscode.Definition> {
        return this.langClient.getDefinition({
            document: {
                uri: document.uri.path,
            },
            position
        }).then(definition => {
            const uri = vscode.Uri.file(definition.uri);
            const start = new vscode.Position(definition.range.start.line, definition.range.start.character);
            const end = new vscode.Position(definition.range.end.line, definition.range.end.character);
            const range = new vscode.Range(start, end);
            const location = new vscode.Location(uri, range);
            return location;
        });
    }
}
