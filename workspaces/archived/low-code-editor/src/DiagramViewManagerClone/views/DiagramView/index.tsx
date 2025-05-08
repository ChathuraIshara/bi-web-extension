/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";

import { BallerinaProjectComponents } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { STKindChecker } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../Contexts/Diagram";
import { Diagram } from "../../../Diagram";
import { DataMapperOverlay } from "../../../Diagram/components/DataMapperOverlay";
import { useHistoryContext } from "../../context/history";
import { extractFilePath } from "../../utils";

import { ServiceView } from "./components/ServiceView";

interface DiagramViewProps {
    projectComponents: BallerinaProjectComponents;
    isLoading: boolean;
}

export function DiagramView(props: DiagramViewProps) {
    const { historyClearAndPopulateWith, historyPop, history, historyUpdateCurrentEntry } = useHistoryContext();
    const {
        props: { syntaxTree, fullST, ballerinaVersion, currentFile },
        api: { openArchitectureView },
    } = useDiagramContext();
    const { projectComponents, isLoading } = props;

    let viewComponent: React.ReactElement;

    if (STKindChecker.isServiceDeclaration(syntaxTree)) {
        viewComponent = <ServiceView isLoading={isLoading} />;
    } else if (currentFile && currentFile.content && STKindChecker.isFunctionDefinition(syntaxTree)
        && STKindChecker.isExpressionFunctionBody(syntaxTree.functionBody)) {

        const handleNavigationHome = () => {
            historyClearAndPopulateWith({
                file: extractFilePath(projectComponents?.packages[0]?.filePath)
            })
        }

        viewComponent = (
            <DataMapperOverlay
                targetPosition={{ ...syntaxTree.position, startColumn: 0, endColumn: 0 }}
                model={syntaxTree}
                ballerinaVersion={ballerinaVersion}
                onCancel={handleNavigationHome}
            />
        )
    } else if (STKindChecker.isTypeDefinition(syntaxTree)
        && STKindChecker.isRecordTypeDesc(syntaxTree.typeDescriptor)) {
        const name = syntaxTree.typeName.value;
        const module = syntaxTree.typeData?.symbol?.moduleID;
        if (!(name && module)) {
            // TODO: Handle error properly
            // tslint:disable-next-line
            console.error('Couldn\'t generate record nodeId to open Architecture view', syntaxTree);
        } else {
            const nodeId = `${module?.orgName}/${module?.moduleName}:${module?.version}:${name}`
            openArchitectureView(nodeId);
        }
        historyPop();
    } else {
        viewComponent = <Diagram />;
    }

    return (
        <>
            {viewComponent}
        </>
    )
}

