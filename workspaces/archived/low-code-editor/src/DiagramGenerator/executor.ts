/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { monaco } from "react-monaco-editor";

import { DiagramEditorLangClientInterface, ExecutorPosition, LineRange } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FunctionDefinition, ServiceDeclaration, STNode, traversNode, Visitor } from "@wso2-enterprise/syntax-tree";

export async function addExecutorPositions(st: any, langClient: DiagramEditorLangClientInterface, file: string) {
    let executorPositions: ExecutorPosition[] = [];

    await langClient.getExecutorPositions({
        documentIdentifier: {
            uri: monaco.Uri.file(file).toString()
        }
    }).then((response: any) => {
        if (response.executorPositions) {
            executorPositions = response.executorPositions;
        }
    });
    mergeExecutorDetails(st, executorPositions);

}

function mergeExecutorDetails(
    stNode: STNode,
    executorPositions: ExecutorPosition[]
) {
    const executorDetailMerger = new ExecutorDetailMerger(executorPositions);
    if (!stNode) {
        return;
    }
    traversNode(stNode, executorDetailMerger);
}

class ExecutorDetailMerger implements Visitor {
    executorPositions: ExecutorPosition[] = [];
    constructor(executorPositions: ExecutorPosition[]) {
        this.executorPositions = executorPositions;
    }

    public beginVisitFunctionDefinition(node: FunctionDefinition) {
        const nodePosition = node.functionName.position;
        if (!nodePosition) {
            return;
        }

        this.executorPositions.forEach((position: ExecutorPosition) => {
            if (this.isInRange(position.range, nodePosition)) {
                node.isRunnable = true;
                node.runArgs = [position.name];
            }
        })
    }

    public beginVisitServiceDeclaration(node: ServiceDeclaration) {
        this.executorPositions.forEach((position: ExecutorPosition) => {
            if (node.qualifiers.length > 0) {
                if (this.isInRange(position.range, node.qualifiers[0].position)) {
                    node.isRunnable = true;
                    node.runArgs = [position.name];
                }
                return;
            }

            if (!node.serviceKeyword.position) {
                return;
            }

            if (this.isInRange(position.range, node.serviceKeyword.position)) {
                node.isRunnable = true;
                node.runArgs = [position.name];
            }
        })
    }

    isInRange(executorRange: LineRange, nodeRange: any) {
        return executorRange.startLine.line === nodeRange.startLine &&
            executorRange.startLine.offset === nodeRange.startColumn
    }
}
