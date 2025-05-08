/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useEffect, useState } from "react";

import { GraphqlDesignDiagram } from "@wso2-enterprise/ballerina-graphql-design-diagram";
import { IBallerinaLangClient } from "@wso2-enterprise/ballerina-languageclient";
import {
    ConfigOverlayFormStatus, DiagramEditorLangClientInterface, STModification,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { TextPreLoader } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import {
    NodePosition, STKindChecker,
    STNode,
} from "@wso2-enterprise/syntax-tree";

import { Context, useDiagramContext } from "../../../Contexts/Diagram";
import { getSyntaxTree } from "../../../DiagramGenerator/generatorUtil";
import { useHistoryContext } from "../../../DiagramViewManagerClone/context/history";
import { isPathEqual } from "../../../DiagramViewManagerClone/utils";
import { ComponentViewInfo } from "../../../OverviewDiagram/util";
import { removeStatement } from "../../utils";
import { FormGenerator, FormGeneratorProps } from "../FormComponents/FormGenerator";

import { graphQLOverlayStyles } from "./style";
import { GraphqlUnsupportedVersionOverlay } from "./UnsupportedVersionOverlay";
import { isGraphqlVisualizerSupported } from "./utils/ls-util";

export interface GraphqlDesignOverlayProps {
    model?: STNode;
    targetPosition?: NodePosition;
    ballerinaVersion?: string;
    onCancel?: () => void;
    configOverlayFormStatus?: ConfigOverlayFormStatus;
    goToSource: (filePath: string, position: NodePosition) => void;
    isLoadingST?: boolean;
}

export function GraphqlDiagramOverlay(props: GraphqlDesignOverlayProps) {
    const { targetPosition, ballerinaVersion, onCancel: onClose, model, goToSource, isLoadingST } = props;

    const graphQLStyleClasses = graphQLOverlayStyles();

    const {
        props: { currentFile, syntaxTree: lowcodeST, fullST },
        api: {
            code: { modifyDiagram },
            ls: { getDiagramEditorLangClient },
        },
    } = useContext(Context);

    const { history } = useHistoryContext();
    const { api: { navigation: { updateSelectedComponent } } } = useDiagramContext();

    const [enableFormGenerator, setEnableFormGenerator] = useState(false);
    const [formConfig, setFormConfig] = useState<FormGeneratorProps>(undefined);

    const isVisualizerSupported = isGraphqlVisualizerSupported(ballerinaVersion);

    const renderFunctionForm = (position: NodePosition, functionType: string, functionModel?: STNode, filePath?: string, completeST?: STNode) => {
        if (STKindChecker.isServiceDeclaration(model) || STKindChecker.isClassDefinition(model)) {
            setFormConfig({
                model: functionModel,
                configOverlayFormStatus: { formType: "GraphqlConfigForm", formName: functionType, isLoading: false },
                targetPosition: position,
                filePath: (filePath !== currentFile.path) ? filePath : undefined,
                currentST: (filePath !== currentFile.path) ? completeST : undefined,
                onCancel: () => {
                    setEnableFormGenerator(false);
                },
            });
            setEnableFormGenerator(true);
        }
    };

    const renderServicePanel = () => {
        if (STKindChecker.isServiceDeclaration(model)) {
            setFormConfig({
                model,
                configOverlayFormStatus: { formType: "ServiceDeclaration", isLoading: false },
                targetPosition: model.position,
                onCancel: () => {
                    setEnableFormGenerator(false);
                },
            });
            setEnableFormGenerator(true);
        }
    }

    const renderRecordEditor = (recordModel: STNode, filePath?: string, completeST?: STNode) => {
        if (STKindChecker.isRecordTypeDesc(recordModel) || STKindChecker.isTypeDefinition(recordModel)) {
            setFormConfig({
                model: recordModel,
                configOverlayFormStatus: { formType: "RecordEditor", isLoading: false },
                targetPosition: recordModel.position,
                filePath: (filePath !== currentFile.path) ? filePath : undefined,
                currentST: (filePath !== currentFile.path) ? completeST : undefined,
                onCancel: () => {
                    setEnableFormGenerator(false);
                },

            });
            setEnableFormGenerator(true);
        }
    }

    const handleDesignOperationClick = (functionPosition: NodePosition, filePath?: string) => {
        const currentElementInfo = history[history.length - 1];
        const filePathToOpen = filePath ? filePath : currentElementInfo.file;
        const componentViewInfo: ComponentViewInfo = {
            filePath: filePathToOpen,
            position: functionPosition
        }
        updateSelectedComponent(componentViewInfo);
    }

    const handleDeleteBtnClick = (position: NodePosition) => {
        const modifications: STModification[] = [];
        const deleteAction: STModification = removeStatement(
            position
        );
        modifications.push(deleteAction);
        modifyDiagram(modifications);
    }

    // This will re-fetch the ST when user has added a new component to a file other than the active file
    useEffect(() => {
        if (formConfig?.filePath
            && !isPathEqual(currentFile.path, formConfig.filePath)
            && formConfig?.configOverlayFormStatus?.formName === "ServiceClassResource") {
            (async () => {
                const langClientPromise: DiagramEditorLangClientInterface = await getDiagramEditorLangClient();
                const syntaxTree: STNode = await getSyntaxTree(formConfig.filePath, langClientPromise);
                setFormConfig({
                    ...formConfig,
                    currentST: syntaxTree
                });
            })();
        }
    }, [fullST]);

    return (
        <div className={graphQLStyleClasses.graphqlDesignViewContainer}>
            {isVisualizerSupported ? (
                <>
                    {!isLoadingST ?
                        <GraphqlDesignDiagram
                            model={model}
                            targetPosition={targetPosition}
                            langClientPromise={
                                getDiagramEditorLangClient() as unknown as Promise<IBallerinaLangClient>
                            }
                            filePath={currentFile.path}
                            currentFile={currentFile}
                            ballerinaVersion={ballerinaVersion}
                            syntaxTree={lowcodeST}
                            functionPanel={renderFunctionForm}
                            servicePanel={renderServicePanel}
                            operationDesignView={handleDesignOperationClick}
                            recordEditor={renderRecordEditor}
                            onDelete={handleDeleteBtnClick}
                            fullST={fullST}
                            goToSource={goToSource}
                        /> : (
                            <TextPreLoader position="absolute" text="Loading..." />
                        )
                    }
                    {enableFormGenerator &&
                        <FormGenerator {...formConfig} />
                    }
                </>
            ) :
                <GraphqlUnsupportedVersionOverlay />
            }
        </div>
    );
}
