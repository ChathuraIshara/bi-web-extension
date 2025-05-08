/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ANALYZE_TYPE, TopBarData } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { BlockStatement, IfElseStatement, NodePosition, RemoteMethodCallAction, ResourceAccessorDefinition, STKindChecker, STNode, traversNode, Visitor } from "@wso2-enterprise/syntax-tree";

import { haveConnectors } from "./connectorVisitor";

export interface ConnectorLatency {
    name: string;
    latency: string;
}

// TODO: find out what kind of invocations analyse here. is it only action invocations.
export function mergeAnalysisDetails(
    stNode: STNode,
    serviceData: TopBarData,
    connectorLatencies: ConnectorLatency[],
    currentResourcePos: NodePosition
) {
    const analysisMerger = new AnalysisDetailMerger(serviceData, connectorLatencies, currentResourcePos);
    if (!stNode) {
        return;
    }
    traversNode(stNode, analysisMerger);
}

export class AnalysisDetailMerger implements Visitor {
    serviceData: TopBarData;
    connectorLatencies: ConnectorLatency[];
    currentResourcePos: NodePosition;
    blocks: BlockStatement[];
    isAdvanced: boolean;
    constructor(serviceData: TopBarData, connectorLatencies: ConnectorLatency[], currentResourcePos: NodePosition) {
        this.serviceData = serviceData;
        this.connectorLatencies = connectorLatencies;
        this.currentResourcePos = currentResourcePos;
        this.blocks = [];
        this.isAdvanced = serviceData.analyzeType === ANALYZE_TYPE.ADVANCED;
    }

    public beginVisitBlockStatement(node: BlockStatement) {
        this.blocks.push(node);
        node.isInSelectedPath = false;
        node.controlFlow = { isReached: false };
        node.statements.forEach((statement) => {
            statement.controlFlow = { isReached: false };
        });
    }

    public endVisitBlockStatement(node: BlockStatement) {
        this.blocks.pop();
        if (node.isInSelectedPath) {
            node.controlFlow = { isReached: true };
            this.updateStatements(node.statements, true);
        }
        node.isInSelectedPath = false;
    }

    public beginVisitIfElseStatement(node: IfElseStatement) {
        if (node.ifBody) {
            node.ifBody.controlFlow = { isReached: false };
        }
        if (node.elseBody?.elseBody) {
            node.elseBody.elseBody.controlFlow = { isReached: false };
        }
        this.updateStatements(node.ifBody.statements, false);
        if (node.elseBody?.elseBody &&
            STKindChecker.isBlockStatement(node.elseBody.elseBody)) this.updateStatements(node.elseBody.elseBody.statements, false);
    }

    public endVisitIfElseStatement(node: IfElseStatement) {
        if (this.isAdvanced && !node.ifBody.controlFlow?.isReached && !node.elseBody?.elseBody?.controlFlow?.isReached) {
            node.isInSelectedPath = true;

            if (!haveConnectors(node.ifBody)) {
                node.ifBody.controlFlow = { isReached: true };
                this.updateStatements(node.ifBody.statements, true);

            } else if (node.elseBody?.elseBody) {
                node.elseBody.elseBody.controlFlow = { isReached: true };
                if (STKindChecker.isBlockStatement(node.elseBody.elseBody)) this.updateStatements(node.elseBody.elseBody.statements, true);
            }
        }
    }

    public beginVisitRemoteMethodCallAction(node: RemoteMethodCallAction) {
        node.controlFlow = { isReached: false };
        const { position: { startLine, startColumn, endLine, endColumn } } = node;
        const key = `(${startLine}:${startColumn},${endLine}:${endColumn})`;

        if (this.isAdvanced) {
            delete node.performance;
        }

        this.connectorLatencies.forEach(data => {
            if (key === data.name) {
                node.performance = { latency: data.latency };

                if (this.blocks.length > 0) {
                    this.blocks.forEach((block) => block.isInSelectedPath = this.isAdvanced);
                }
                node.controlFlow = { isReached: this.isAdvanced };
            }
        });
    }

    public beginVisitResourceAccessorDefinition(node: ResourceAccessorDefinition) {
        if (this.currentResourcePos && node.position.startLine === this.currentResourcePos.startLine &&
            node.position.startColumn === this.currentResourcePos.startColumn) {
            node.performance = {
                concurrency: this.serviceData.concurrency, latency: this.serviceData.latency,
                tps: this.serviceData.tps, analyzeType: this.serviceData.analyzeType
            };

            if (STKindChecker.isFunctionBodyBlock(node.functionBody)) {
                node.functionBody.statements.forEach((statement) => {
                    statement.controlFlow = { isReached: this.isAdvanced }
                });
            }
        } else if (this.isAdvanced) {
            delete node.performance;
            if (STKindChecker.isFunctionBodyBlock(node.functionBody)) {
                this.updateStatements(node.functionBody.statements, false);
            }
        }
    }

    updateStatements(statements: any, isReached: boolean) {
        statements.forEach((statement: any) => {
            statement.controlFlow = { isReached }
        });
    }
};
