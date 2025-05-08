/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ActorNodeModel } from "../components/nodes/ActorNode";
import { ButtonNodeModel } from "../components/nodes/ButtonNode/ButtonNodeModel";
import { ConnectionNodeModel } from "../components/nodes/ConnectionNode";
import { EntryNodeModel } from "../components/nodes/EntryNode";

export type NodeModel = EntryNodeModel | ConnectionNodeModel | ActorNodeModel | ButtonNodeModel;

export type Project = {
    name: string;
    entryPoints: EntryPoint[];
    connections: Connection[];
};

export type EntryPointType = "service" | "task" | "schedule-task" | "trigger" | string;

export type EntryPoint = {
    id: string;
    name: string;
    type: EntryPointType;
    location?: Location;
    icon?: React.ReactNode;
    label?: string;
    description?: string;
    connections?: string[];
};

export type Connection = {
    id: string;
    name: string;
    location?: Location;
};

export type Location = {
    filePath: string;
    position: NodePosition;
};

export type NodePosition = {
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
};
