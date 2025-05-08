
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
*
* This software is the property of WSO2 LLC. and its suppliers, if any.
* Dissemination of any information or reproduction of any material contained
* herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
* You may not alter or remove any copyright or other notice from copies of this content.
*/
import { DMType } from "@wso2-enterprise/mi-core";
import { Expression, FunctionDeclaration, Node, ObjectLiteralExpression, PropertyAssignment, VariableDeclaration, ts } from "ts-morph";

import { DataMapperContext } from "../../../utils/DataMapperContext/DataMapperContext";
import { View } from "../../../components/DataMapper/Views/DataMapperView";
import { getFocusedSubMapping, traversNode } from "./st-utils";
import { getDMType, getTypeForVariable } from "./type-utils";
import { NodeInitVisitor } from "../../../components/Visitors/NodeInitVisitor";
import { getArrayFilterNode, getOutputNode, getSubMappingNode } from "./node-utils";
import { DataMapperNodeModel } from "../Node/commons/DataMapperNode";
import { FocusedInputNode } from "../Node";

interface SubMappingDetails {
    subMappingType: DMType;
    varDecl: VariableDeclaration;
    mapFnIndex: number;
    sourceFieldFQN: string;
}

export function getFocusedSubMappingExpr(
    initializer: Expression,
    mapFnIndex?: number,
    sourceFieldFQN?: string
) {
    if (mapFnIndex === undefined) return initializer;

    let targetNode = initializer;

    if (Node.isCallExpression(initializer)) {
        // Get the map function contains the mapping
        targetNode = initializer.getArguments()[0] as Expression;
    } else if (Node.isObjectLiteralExpression(initializer) && sourceFieldFQN) {
        targetNode = getTargetNodeFromProperties(initializer, sourceFieldFQN);
    }
    // TODO: Handle other node types

    // Constraint: In focused views, return statements are only allowed at map functions
    const returnStmts = targetNode.getDescendantsOfKind(ts.SyntaxKind.ReturnStatement);

    if (returnStmts.length >= mapFnIndex) {
        const returnStmt = returnStmts[mapFnIndex];
        if (returnStmt) {
            return returnStmt.getExpression();
        }
    }

    return targetNode;

    function getTargetNodeFromProperties(initializer: Expression, sourceFieldFQN: string): Expression | undefined {
        const properties = sourceFieldFQN.match(/(?:[^\s".']|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')+/g) || [];
    
        if (!properties) return initializer;
    
        let currentExpr: Expression | undefined = initializer;
    
        for (let property of properties) {
            if (!isNaN(Number(property))) continue;
    
            if (Node.isObjectLiteralExpression(currentExpr)) {
                const propAssignment = findPropAssignment(currentExpr, property);
                currentExpr = propAssignment.getInitializer();
            }
        }
    
        return currentExpr;
    }
    
    function findPropAssignment(currentExpr: ObjectLiteralExpression, property: string): PropertyAssignment | undefined {
        return currentExpr.getProperties().find((val) =>
            Node.isPropertyAssignment(val)
            && val.getName() === property
        ) as PropertyAssignment;
    }
}

export function initializeSubMappingContext(
    lastView: View,
    context: DataMapperContext,
    subMappingTypes: Record<string, DMType>,
    fnST: FunctionDeclaration
) {
    const { subMappingInfo, sourceFieldFQN, targetFieldFQN } = lastView;
    const { index, mapFnIndex, mappingName } = subMappingInfo;
    let focusedST = getFocusedSubMapping(index, fnST);
    context.focusedST = focusedST;

    const varDecl = focusedST.getDeclarations()[0];
    let subMappingType = getTypeForVariable(subMappingTypes, varDecl, mapFnIndex);
    if (targetFieldFQN && targetFieldFQN !== mappingName) {
        subMappingType = getDMType(targetFieldFQN, subMappingType, mapFnIndex + 1);
    }
    return { subMappingType, varDecl, mapFnIndex, sourceFieldFQN };
};

export function buildNodeListForSubMappings(
    context: DataMapperContext,
    nodeInitVisitor: NodeInitVisitor,
    subMappingDetails: SubMappingDetails
) {
    const { subMappingType, varDecl, mapFnIndex, sourceFieldFQN } = subMappingDetails;
    if (subMappingType) {
        traversNode(context.focusedST, nodeInitVisitor);

        const inputNode = mapFnIndex === undefined
            ? nodeInitVisitor.getRootInputNode()
            : nodeInitVisitor.getInputNode();
        const intermediateNodes = nodeInitVisitor.getIntermediateNodes();
        const varDeclInitializer = varDecl.getInitializer();
        const subMappingExpr = getFocusedSubMappingExpr(varDeclInitializer, mapFnIndex, sourceFieldFQN);
        const outputNode = getOutputNode(context, subMappingExpr, subMappingType, true);

        const subMappingNode = getSubMappingNode(context);

        let arrayFilterNode: DataMapperNodeModel;
        if (inputNode instanceof FocusedInputNode) {
            arrayFilterNode = getArrayFilterNode(inputNode);
        }

        const nodeList = [inputNode, subMappingNode, outputNode, ...intermediateNodes];

        if (arrayFilterNode) {
            nodeList.unshift(arrayFilterNode);
        }

        return nodeList;
    }
    return [];
};
