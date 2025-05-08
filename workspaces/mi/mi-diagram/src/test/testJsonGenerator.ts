/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import path from 'path';
import fs from 'fs';
import { LanguageClient } from './lang-service/client';
import { APIResource } from '@wso2-enterprise/mi-syntax-tree/lib/src';

export async function generateJsonFromXml() {
    const langClient = new LanguageClient();
    await langClient.start();

    const dataRoot = path.join(__dirname, 'data', 'input-xml');
    const files = fs.readdirSync(dataRoot).filter(file => file.endsWith('.xml'));
    const result = [];

    for (const file of files) {
        const uri = path.join(dataRoot, file);
        const syntaxTree = await langClient.getSyntaxTree({
            documentIdentifier: { uri }
        });

        if (syntaxTree.syntaxTree.api.resource && syntaxTree.syntaxTree.api.resource.length > 0) {
            const resources = syntaxTree.syntaxTree.api.resource;
            const resourcePaths = resources.map((resource: APIResource) => ({
                path: resource.uriTemplate || resource.urlMapping,
                methods: resource.methods
            }));
            result.push({ file, resources: resourcePaths });
        }
    }

    langClient.stop();
    fs.writeFileSync(path.join(__dirname, 'data', 'files.json'), JSON.stringify(result, null, 2));
}
