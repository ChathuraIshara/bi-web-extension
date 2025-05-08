/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */


import { BaseModel } from "@projectstorm/react-canvas-core";
import {
    ListConstructorNode,
    MappingConstructorNode,
    PrimitiveTypeNode,
    QueryExpressionNode,
    RequiredParamNode,
    EnumTypeNode,
    FromClauseNode,
    JoinClauseNode,
    LetClauseNode,
    LetExpressionNode,
    LinkConnectorNode,
    ModuleVariableNode,
    UnionTypeNode,
    UnsupportedIONode
} from "../Node";
import { IO_NODE_DEFAULT_WIDTH } from "../utils/constants";
import { ExpandedMappingHeaderNode } from "../Node/ExpandedMappingHeader";

export type InputNode =
    | RequiredParamNode
    | FromClauseNode
    | LetExpressionNode
    | ModuleVariableNode
    | EnumTypeNode
    | LetClauseNode
    | JoinClauseNode
    | ExpandedMappingHeaderNode;

export type NodeWithoutTypeDesc = 
    | LetExpressionNode
    | ModuleVariableNode
    | EnumTypeNode
    | ExpandedMappingHeaderNode;

type OutputNode =
    | MappingConstructorNode
    | ListConstructorNode
    | PrimitiveTypeNode
    | UnionTypeNode
    | UnsupportedIONode;

type IntermediateNode = 
    | LinkConnectorNode
    | QueryExpressionNode;
    
export const MIN_VISIBLE_HEIGHT = 68;
export const INPUT_NODE_DEFAULT_RIGHT_X = IO_NODE_DEFAULT_WIDTH;

export function isInputNode(node: BaseModel): node is InputNode {
    return (
        node instanceof RequiredParamNode ||
        node instanceof FromClauseNode ||
        node instanceof LetExpressionNode ||
        node instanceof ModuleVariableNode ||
        node instanceof EnumTypeNode ||
        node instanceof LetClauseNode ||
        node instanceof JoinClauseNode ||
        node instanceof ExpandedMappingHeaderNode
    );
}

export function isOutputNode(node: BaseModel): node is OutputNode {
    return (
        node instanceof MappingConstructorNode ||
        node instanceof ListConstructorNode ||
        node instanceof PrimitiveTypeNode ||
        node instanceof UnionTypeNode ||
        node instanceof UnsupportedIONode
    );
}

export function isIntermediateNode(node: BaseModel): node is IntermediateNode {
    return (
        node instanceof LinkConnectorNode ||
        node instanceof QueryExpressionNode
    );
}
