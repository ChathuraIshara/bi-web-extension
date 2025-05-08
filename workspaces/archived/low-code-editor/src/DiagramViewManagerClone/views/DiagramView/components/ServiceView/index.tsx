/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { useEffect, useState } from "react";

import { NodePosition, ServiceDeclaration, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../Contexts/Diagram";
import { GraphqlDiagramOverlay } from "../../../../../Diagram/components/GraphqlDiagramOverlay";
import { ServiceDesignOverlay } from "../../../../../Diagram/components/ServiceDesignOverlay";
import { ServiceInvalidOverlay } from "../../../../../Diagram/components/ServiceInvalidOverlay";
import { ServiceUnsupportedOverlay } from "../../../../../Diagram/components/ServiceUnsupported";
import { useHistoryContext } from "../../../../context/history";
import { getSTNodeForReference } from "../../../../utils";

interface ServiceViewProps {
    isLoading: boolean;
}

export function ServiceView(props: ServiceViewProps) {
    const {
        api: {
            ls: { getDiagramEditorLangClient },
            code: { gotoSource }
        },
        props: { syntaxTree, ballerinaVersion, currentFile },
    } = useDiagramContext();
    const { isLoading } = props;
    const { history, historyClearAndPopulateWith } = useHistoryContext();
    const [listnerType, setListenerType] = useState<string>();

    useEffect(() => {
        (async () => {
            let listenerSignature: string;
            if (syntaxTree && STKindChecker.isServiceDeclaration(syntaxTree)) {
                const listenerExpression = syntaxTree.expressions[0];
                if (STKindChecker.isExplicitNewExpression(listenerExpression)) {
                    const typeData = listenerExpression.typeData;
                    const typeSymbol = typeData?.typeSymbol;
                    listenerSignature = typeSymbol?.signature;
                } else {
                    try {
                        const langClient = await getDiagramEditorLangClient();
                        const listenerSTDecl = await getSTNodeForReference(currentFile.path, listenerExpression.position, langClient);
                        if (listenerSTDecl) {
                            const typeData = listenerExpression.typeData;
                            const typeSymbol = typeData?.typeSymbol;
                            listenerSignature = typeSymbol?.signature;
                        }
                    } catch (err) {
                        // tslint:disable-next-line: no-console
                        console.error(err);
                    }
                }
            }

            setListenerType(listenerSignature);
        })();
    }, [syntaxTree])

    let serviceComponent: JSX.Element;

    if (listnerType) {

        const listenerExpression = (syntaxTree as ServiceDeclaration).expressions[0];
        const typeData = listenerExpression.typeData;
        const typeSymbol = typeData?.typeSymbol;
        const signature = typeSymbol?.signature;

        const handleOnCancel = () => {
            historyClearAndPopulateWith({ file: history[history.length - 1].file });
        }

        if (listnerType.includes("http")) {
            serviceComponent = (
                <ServiceDesignOverlay
                    model={syntaxTree}
                    targetPosition={{ ...syntaxTree.position, startColumn: 0, endColumn: 0 }}
                    onCancel={handleOnCancel}
                />
            );
        } else if (listnerType.includes('graphql')) {
            const handleGoToSource = (filePath: string, position: NodePosition) => {
                gotoSource(
                    { startLine: position.startLine, startColumn: position.startColumn },
                    filePath
                );
            }

            serviceComponent = (
                <GraphqlDiagramOverlay
                    model={syntaxTree}
                    targetPosition={syntaxTree.position}
                    ballerinaVersion={ballerinaVersion}
                    onCancel={handleOnCancel}
                    goToSource={handleGoToSource}
                    isLoadingST={isLoading}
                />
            );
        } else if (signature && signature === "$CompilationError$") {
            serviceComponent = (
                <ServiceInvalidOverlay />
            );
        } else {
            serviceComponent = (
                <ServiceUnsupportedOverlay />
            )
        }
    }

    return (
        <>
            {serviceComponent}
        </>
    )
}

