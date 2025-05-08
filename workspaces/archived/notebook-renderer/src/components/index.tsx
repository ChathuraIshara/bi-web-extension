/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { h, render } from 'preact';
import { ActivationFunction, OutputItem, RendererContext } from 'vscode-notebook-renderer';
import { MIME_TYPE_JSON, MIME_TYPE_TABLE, MIME_TYPE_XML } from './renderer/constants';
import { JsonForNotebookOutput } from './renderer/json/json';
import { TableForNotebookOutput } from './renderer/table/table';
import { getIsDarkMode } from './renderer/utils';
import { Xml } from "./renderer/xml/xml";

export const activate: ActivationFunction = (context: RendererContext<any>) => ({
    renderOutputItem(data: OutputItem, element) {
        try {
            switch (data.mime) {
                case MIME_TYPE_TABLE:
                    render(<TableForNotebookOutput notebookCellOutput={data.json()} />, element);
                    break;
                case MIME_TYPE_JSON:
                    render(<JsonForNotebookOutput notebookCellOutput={data.json()} />, element);
                    break;
                case MIME_TYPE_XML:
                    render(<Xml notebookCellOutput={data.json()} />, element);
                    break;
                default:
                    break;
            }
        } catch {
            let match = data.text().match(/^{\n\t"shellValue": {\n\t\t"value": (?<value>.*),\n\t\t"mimeType": "/);
            const darkMode = getIsDarkMode();
            render(<div>
                <p style={darkMode ? { color: "rgb(244,135,113)" } : { color: "rgb(161, 38, 13)" }}>
                    Error in rendering output!
                </p>
                <p>{match?.groups ? match.groups.value : data.text()}</p>
            </div>, element);
        }
    }
});
