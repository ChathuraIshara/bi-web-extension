/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { CancellationToken, Event, TextDocumentContentProvider, Uri, workspace} from 'vscode';

/**
 * Text document content provider for read only files.
 *
 * @class ReadOnlyContentProvider
 * @extends {TextDocumentContentProvider}
 */
export class ReadOnlyContentProvider implements TextDocumentContentProvider{

    onDidChange?: Event<Uri> | undefined;
    async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
        // create new Uri object to convert the schema to file.
        let fileUri = Uri.file(uri.path);
        const content = await workspace.fs.readFile(fileUri);
        return content.toString();
    }
}
