/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FlowNode, LineRange } from "@wso2-enterprise/ballerina-core";
import { FormImports, FormValues } from "@wso2-enterprise/ballerina-side-panel";
import { RemoveEmptyNodesVisitor, traverseNode } from "@wso2-enterprise/bi-diagram";

import { updateNodeProperties } from "../../../utils/bi";

export function createNodeWithUpdatedLineRange(node: FlowNode, targetLineRange: LineRange): FlowNode {
    return {
        ...node,
        codedata: {
            ...node.codedata,
            lineRange: {
                ...node.codedata.lineRange,
                startLine: targetLineRange.startLine,
                endLine: targetLineRange.endLine,
            },
        }
    }
}

export function processFormData(data: FormValues): FormValues {
    if ("update-variable" in data) {
        data["variable"] = data["update-variable"];
        data["type"] = "";
    }
    return data;
}

export function updateNodeWithProperties(
    node: FlowNode,
    updatedNode: FlowNode,
    data: FormValues,
    formImports: FormImports
): FlowNode {
    const newNode = { ...updatedNode };

    if (node.branches?.at(0)?.properties) {
        // branch properties
        newNode.branches[0].properties = updateNodeProperties(data, node.branches[0].properties, formImports);
    } else if (node.properties) {
        // node properties
        newNode.properties = updateNodeProperties(data, node.properties, formImports);
    } else {
        console.error(">>> Error updating source code. No properties found");
    }

    return newNode;
}

export function removeEmptyNodes(updatedNode: FlowNode): FlowNode {
    const removeEmptyNodeVisitor = new RemoveEmptyNodesVisitor(updatedNode);
    traverseNode(updatedNode, removeEmptyNodeVisitor);
    return removeEmptyNodeVisitor.getNode();
}
