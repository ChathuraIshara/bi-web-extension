/**
* Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
*
* This software is the property of WSO2 LLC. and its suppliers, if any.
* Dissemination of any information or reproduction of any material contained
* herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
* You may not alter or remove any copyright or other notice from copies of this content.
*/

import { API, Datamapper, NamedSequence, Proxy, Template, Task, InboundEndpoint } from "@wso2-enterprise/mi-syntax-tree/lib/src";

export enum DIAGRAM_KIND {
    API = "api",
    SEQUENCE = "sequence",
    PROXY = "proxy",
    DATA_MAPPER = "data_mapper",
    TEMPLATE = "template",
    TASK = "task",
    INBOUND_ENDPOINT = "inboundEndpoint",
}

export declare enum DIRECTORY_MAP {
    SERVICES = "services",
    TRIGGERS = "triggers",
    CONNECTIONS = "connections",
    SCHEDULED_TASKS = "tasks"
}

export type SyntaxTreeMi = {
    [DIAGRAM_KIND.API]: API;
    [DIAGRAM_KIND.SEQUENCE]: NamedSequence;
    [DIAGRAM_KIND.PROXY]: Proxy;
    [DIAGRAM_KIND.DATA_MAPPER]: Datamapper;
    [DIAGRAM_KIND.TEMPLATE]: Template;
    [DIAGRAM_KIND.TASK]: Task;
    [DIAGRAM_KIND.INBOUND_ENDPOINT]: InboundEndpoint;
}
