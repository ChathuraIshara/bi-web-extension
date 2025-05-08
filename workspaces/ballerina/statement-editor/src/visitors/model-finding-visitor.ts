/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    NodePosition,
    STNode,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import { INPUT_EDITOR_PLACEHOLDERS } from "../components/InputEditor/constants";
import { DEFAULT_INTERMEDIATE_CLAUSE, DEFAULT_WHERE_INTERMEDIATE_CLAUSE } from "../constants";
import { isPositionsEquals } from "../utils";

class ModelFindingVisitor implements Visitor {
    private position: NodePosition;
    private model: STNode;

    public beginVisitSTNode(node: STNode, parent?: STNode) {
        if (isPositionsEquals(node.position, this.position)) {
            this.model = node;
        } else if ((INPUT_EDITOR_PLACEHOLDERS.has(node?.source?.trim()) && !node?.source?.startsWith(DEFAULT_INTERMEDIATE_CLAUSE)) ||
            node?.source?.trim().includes(DEFAULT_WHERE_INTERMEDIATE_CLAUSE)) {
                const isWithinRange = this.position.startLine <= node.position.startLine
                    && this.position.endLine >= node.position.endLine
                    && this.position.startColumn <= node.position.endColumn
                    && this.position.endColumn >= node.position.startColumn;
                if (isWithinRange) {
                    this.model = node;
                }
        }
    }

    getModel(): STNode {
        const newModel = this.model;
        this.model = undefined;
        return newModel;
    }

    setPosition(position: NodePosition) {
        this.position = position;
    }
}

export const visitor = new ModelFindingVisitor();
