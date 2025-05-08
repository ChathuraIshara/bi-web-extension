/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum SHARED_COMMANDS {
    FORCE_UPDATE_PROJECT_ARTIFACTS = 'ballerina.force.update.artifacts',
    SHOW_VISUALIZER = 'ballerina.show.visualizer',
    GET_STATE_CONTEXT = 'ballerina.get.stateContext',
    OPEN_BI_WELCOME = 'ballerina.open.bi.welcome',
    OPEN_BI_NEW_PROJECT = 'ballerina.open.bi.new',
    OPEN_SERVICE_FORM = 'ballerina.open.service.form',
    OPEN_AI_PANEL = 'ballerina.open.ai.panel',
    CLOSE_AI_PANEL = 'ballerina.close.ai.panel',
    CLEAR_AI_PROMPT = 'ballerina.clear.ai.prompt',
    OPEN_AGENT_CHAT = 'ballerina.open.agent.chat'
}

export const BI_COMMANDS = {
    BI_RUN_PROJECT: 'BI.project.run',
    BI_DEBUG_PROJECT: 'BI.project.debug',
    REFRESH_COMMAND: 'BI.project-explorer.refresh',
    FOCUS_PROJECT_EXPLORER: 'BI.project-explorer.focus',
    PROJECT_EXPLORER: 'BI.project-explorer',
    ADD_CONNECTIONS: 'BI.project-explorer.add-connection',
    DELETE_COMPONENT: 'BI.project-explorer.delete',
    ADD_ENTRY_POINT: 'BI.project-explorer.add-entry-point',
    ADD_TYPE: 'BI.project-explorer.add-type',
    ADD_FUNCTION: 'BI.project-explorer.add-function',
    OPEN_TYPE_DIAGRAM: 'BI.view.typeDiagram',
    ADD_CONFIGURATION: 'BI.project-explorer.add-configuration',
    ADD_PROJECT: 'BI.project-explorer.add',
    SHOW_OVERVIEW: 'BI.project-explorer.overview',
    SWITCH_PROJECT: 'BI.project-explorer.switch-project',
    ADD_DATA_MAPPER: 'BI.project-explorer.add-data-mapper',
    BI_EDIT_TEST_FUNCTION: 'BI.test.edit.function',
    BI_ADD_TEST_FUNCTION: 'BI.test.add.function',
    BI_EDIT_TEST_FUNCTION_DEF: 'BI.test.edit.function.def',
    ADD_NATURAL_FUNCTION: 'BI.project-explorer.add-natural-function',
};
