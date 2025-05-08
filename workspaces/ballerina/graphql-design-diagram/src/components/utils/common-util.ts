/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodePosition, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

import { NodeCategory, NodeType } from "../NodeFilter";
import { GraphqlDesignModel, Position } from "../resources/model";
import {visitor as STNodeFindingVisitor } from "../visitors/STNodeFindingVisitor";

export function getSTNodeFromRange(position: NodePosition, model: STNode): STNode {
    STNodeFindingVisitor.setPosition(position);
    traversNode(model, STNodeFindingVisitor);
    return STNodeFindingVisitor.getSTNode();
}

export function getParentSTNodeFromRange(position: NodePosition, model: STNode): STNode {
    STNodeFindingVisitor.setPosition(position);
    traversNode(model, STNodeFindingVisitor);
    return STNodeFindingVisitor.getParent();
}

export function getFormattedPosition(position: Position): NodePosition {
    return {
        startLine: position.startLine.line,
        endLine: position.endLine.line,
        startColumn: position.startLine.offset,
        endColumn: position.endLine.offset,
    };
}

export function getComponentName(name: string): string {
    return name?.replace(/[!\[\]]/g, "");
}

export function getNodeListOfModel(model: GraphqlDesignModel) {
    const nodes: NodeType[] = [];
    nodes.push({type: NodeCategory.GRAPHQL_SERVICE, name: model.graphqlService.serviceName});
    if (model.records) {
        Object.entries(model.records).forEach(([key]) => {
            if (!model.records[key]?.isInputObject) {
                nodes.push({type: NodeCategory.RECORD, name: key});
            }
        });
    }
    if (model.serviceClasses) {
        Object.entries(model.serviceClasses).forEach(([key]) => {
            nodes.push({type: NodeCategory.SERVICE_CLASS, name: key});
        });
    }
    if (model.unions) {
        Object.entries(model.unions).forEach(([key]) => {
            nodes.push({type: NodeCategory.UNION, name: key});
        });
    }
    if (model.enums) {
        Object.entries(model.enums).forEach(([key]) => {
            nodes.push({type: NodeCategory.ENUM, name: key});
        });
    }
    if (model.interfaces) {
        Object.entries(model.interfaces).forEach(([key]) => {
            nodes.push({type: NodeCategory.INTERFACE, name: key});
        });
    }
    return nodes;
}
