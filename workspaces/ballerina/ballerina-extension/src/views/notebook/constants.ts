/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/* Ballerina notebook extension */
export const BAL_NOTEBOOK = ".balnotebook";

/* Notebook type */
export const NOTEBOOK_TYPE = "ballerina-notebook";

/* Notebook cell scheme */
export const NOTEBOOK_CELL_SCHEME = 'vscode-notebook-cell';

/* Available mime type to render */
export const MIME_TYPE_TABLE = "ballerina-notebook/table-view";
export const MIME_TYPE_JSON = "ballerina-notebook/json-view";
export const MIME_TYPE_XML = "ballerina-notebook/xml-view";
export const CUSTOM_DESIGNED_MIME_TYPES = [
    MIME_TYPE_TABLE,
    MIME_TYPE_JSON,
    MIME_TYPE_XML
];

/* Commands for notebook*/
export const RESTART_NOTEBOOK_COMMAND = "ballerina.notebook.restartNotebook";
export const OPEN_OUTLINE_VIEW_COMMAND = "ballerina.notebook.openOutlineView";
export const OPEN_VARIABLE_VIEW_COMMAND = "ballerina.notebook.openVariableView";
export const UPDATE_VARIABLE_VIEW_COMMAND = "ballerina.notebook.refreshVariableView";
export const CREATE_NOTEBOOK_COMMAND = "ballerina.notebook.createNotebook";
export const DEBUG_NOTEBOOK_COMMAND = "ballerina.notebook.debug";
