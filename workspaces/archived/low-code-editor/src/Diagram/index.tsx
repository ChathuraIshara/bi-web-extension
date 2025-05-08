/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";

import { DefaultConfig, LowCodeDiagram, PlusViewState, ViewState } from "@wso2-enterprise/ballerina-low-code-diagram";
import {
    ConfigOverlayFormStatus,
    ConnectorWizardProps,
    DiagramEditorLangClientInterface,
    DiagramOverlayPosition,
    LowcodeEvent,
    OPEN_LOW_CODE,
    PlusWidgetProps,
    STModification
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { DiagramTooltipCodeSnippet } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition, STKindChecker, STNode, traversNode } from "@wso2-enterprise/syntax-tree";

import { Context as DiagramContext } from "../Contexts/Diagram";
import { addAdvancedLabels } from "../DiagramGenerator/performanceUtil";

import { DataMapperOverlay } from "./components/DataMapperOverlay";
import { ConnectorWizard } from "./components/FormComponents/ConfigForms/ConnectorWizard";
import * as DialogBoxes from "./components/FormComponents/DialogBoxes";
import { FormGenerator, FormGeneratorProps } from "./components/FormComponents/FormGenerator";
import { GraphqlDiagramOverlay } from "./components/GraphqlDiagramOverlay";
import { ServiceDesignOverlay } from "./components/ServiceDesignOverlay";
import "./style.scss";
import { useStyles } from "./styles";
import { getListenerSignatureFromMemberNode } from "./utils";
import { removeStatement } from "./utils/modification-util";
import { visitor as STFindingVisitor } from "./visitors/st-finder-visitor";


export function Diagram() {
    const {
        api: {
            code: {
                modifyDiagram,
                gotoSource,
                getFunctionDef
            },
            webView: {
                showTryitView
            },
            project: {
                run
            },
            insights: {
                onEvent
            },
            ls: {
                getDiagramEditorLangClient
            },
            navigation
        },
        props: {
            syntaxTree,
            fullST,
            isLoadingAST,
            isReadOnly,
            stSymbolInfo,
            error,
            selectedPosition,
            zoomStatus,
            ballerinaVersion,
            experimentalEnabled,
            openInDiagram,
            currentFile
        },
    } = useContext(DiagramContext);

    const classes = useStyles();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formConfig, setFormConfig] = useState<FormGeneratorProps>(undefined);
    const [isConnectorConfigWizardOpen, setIsConnectorConfigWizardOpen] = useState(false);
    const [connectorWizardProps, setConnectorWizardProps] = useState<ConnectorWizardProps>(undefined);
    const [isDialogActive, setIsDialogActive] = useState(false);
    const [activeDialog, setActiveDialog] = useState(undefined);

    let isDataMapperOpen = isFormOpen && formConfig.configOverlayFormStatus.formType === "DataMapper";
    const isServiceDesignOpen = isFormOpen && formConfig.configOverlayFormStatus.formType === "ServiceDesign";
    let isGraphQLViewOpen = isFormOpen && formConfig.configOverlayFormStatus.formType === "GraphQL";

    React.useEffect(() => {
        // Identify low-code open event
        const event: LowcodeEvent = {
            type: OPEN_LOW_CODE,
        };
        onEvent(event);
    }, []);

    React.useEffect(() => {
        if (openInDiagram && Object.keys(openInDiagram).some(k => k !== null)) {
            STFindingVisitor.setPosition(openInDiagram);
            traversNode(syntaxTree, STFindingVisitor);
            const stNode = STFindingVisitor.getSTNode();
            if (stNode) {
                let formType = stNode.kind;
                if (STKindChecker.isFunctionDefinition(stNode)
                    && STKindChecker.isExpressionFunctionBody(stNode.functionBody)
                ) {
                    isDataMapperOpen = true;
                    formType = 'DataMapper'
                } else if (STKindChecker.isTypeDefinition(stNode)
                    && STKindChecker.isRecordTypeDesc(stNode.typeDescriptor)
                ) {
                    formType = 'RecordEditor'
                } else if (STKindChecker.isServiceDeclaration(stNode)) { // TODO: check for graphql
                    formType = 'GraphQL'
                    isGraphQLViewOpen = true;
                }
                handleDiagramEdit(stNode, openInDiagram, {
                    formType,
                    isLoading: false
                });
            }
        }
    }, [openInDiagram]);



    const handleDiagramAdd = (targetPosition: NodePosition, configOverlayFormStatus: ConfigOverlayFormStatus, onClose?: () => void, onSave?: () => void) => {
        setFormConfig({
            configOverlayFormStatus,
            onCancel: () => {
                setIsFormOpen(false);
                if (onClose) {
                    onClose();
                }
            },
            onSave: () => {
                setIsFormOpen(false);
                if (onSave) {
                    onSave();
                }
            },
            targetPosition
        });
        setIsFormOpen(true);
        setIsConnectorConfigWizardOpen(false);
    };

    const handleDiagramEdit = (model: STNode, targetPosition: NodePosition, configOverlayFormStatus: ConfigOverlayFormStatus, onClose?: () => void, onSave?: () => void) => {
        setFormConfig({
            model,
            configOverlayFormStatus,
            onCancel: () => {
                setIsFormOpen(false);
                if (onClose) {
                    onClose();
                }
            },
            onSave: () => {
                setIsFormOpen(false);
                if (onSave) {
                    onSave();
                }
            },
            targetPosition
        });
        setIsFormOpen(true);
        setIsConnectorConfigWizardOpen(false);
    };

    const handleConnectorWizard = (props: ConnectorWizardProps) => {
        setConnectorWizardProps({
            ...props,
            onSave: () => {
                setIsConnectorConfigWizardOpen(false);
                if (props.onSave) {
                    props.onSave();
                }
            },
            onClose: () => {
                setIsConnectorConfigWizardOpen(false);
                if (props.onClose) {
                    props.onClose();
                }
            }
        });
        setIsFormOpen(false);
        setIsConnectorConfigWizardOpen(true);
    };

    const handleDeleteComponent = (model: STNode, onDelete?: () => void) => {
        const modifications: STModification[] = [];

        // delete action
        if (STKindChecker.isIfElseStatement(model) && !model.viewState.isMainIfBody) {
            const ifElseRemovePosition = model.position;
            ifElseRemovePosition.endLine = model.elseBody.elseBody.position.startLine;
            ifElseRemovePosition.endColumn = model.elseBody.elseBody.position.startColumn;

            const deleteConfig: STModification = removeStatement(ifElseRemovePosition);
            modifications.push(deleteConfig);
            modifyDiagram(modifications);
        } else {
            const deleteAction: STModification = removeStatement(
                model.position
            );
            modifications.push(deleteAction);
            modifyDiagram(modifications);
        }

        // If onDelete callback is available invoke it.
        if (onDelete) {
            onDelete();
        }
    };

    const handleCloseAllOpenedForms = (callBack: () => void) => {
        setIsConnectorConfigWizardOpen(false);
        setIsFormOpen(false);
        setIsDialogActive(false);
        if (callBack) {
            callBack();
        }
    }

    const handleRenderDialogBox = (type: string, onConfirm: () => void, onCancel?: () => void, position?: DiagramOverlayPosition, overlayId?: string, message?: string, removeText?: string, isFunctionMember?: boolean) => {
        const ChildComp = (DialogBoxes as any)[type];
        if (!ChildComp) {
            return;
        }
        const handleOnConfirm = () => {
            onConfirm();
            setIsDialogActive(false);
        };

        const handleOnCancel = () => {
            if (onCancel) {
                onCancel();
            }
            setIsDialogActive(false);
        };

        setActiveDialog(<ChildComp onConfirm={handleOnConfirm} onCancel={handleOnCancel} position={position} overlayId={overlayId} message={message} removeText={removeText} isFunctionMember={isFunctionMember} />);
        setIsDialogActive(true);
    };

    const handleRenderPlusWidget = (dialogType: string, plusWidgetProps: PlusWidgetProps, plusViewState?: PlusViewState): any => {
        const configOverlayFormStatus: ConfigOverlayFormStatus = {
            isLoading: false,
            formType: dialogType,
            formArgs: {
                ...plusWidgetProps,
                viewState: plusViewState
            }
        };

        setFormConfig({
            configOverlayFormStatus,
            onCancel: () => {
                setIsFormOpen(false);
                if (plusWidgetProps.onClose) {
                    plusWidgetProps.onClose();
                }
            },
            onSave: () => {
                setIsFormOpen(false);
            }
        });
        setIsFormOpen(true);
        setIsConnectorConfigWizardOpen(false);
    };

    const handleShowTooltip = (
        component: any,
        content?: string,
        onClick?: () => void,
        model?: STNode): any => {
        return (
            <DiagramTooltipCodeSnippet content={content} componentModel={model} onClick={onClick}  >
                {component}
            </DiagramTooltipCodeSnippet>
        );
    };

    const handleOpenPerformanceChart = async (name: string, range: NodePosition, diagramRedrawFunc: any) => {
        await addAdvancedLabels(name, range, diagramRedrawFunc);
    };

    const getListenerSignature = async (functionNode: STNode): Promise<string> => {
        const langClient: DiagramEditorLangClientInterface = await getDiagramEditorLangClient();
        return getListenerSignatureFromMemberNode(fullST, functionNode, langClient, currentFile.path);
    }

    const textLoader = (
        <div className={classes.progressContainer}>
            {/* <TextPreLoader position="absolute" text={loaderText} /> */}
            loading
        </div>
    );

    if (!syntaxTree) {
        if (isLoadingAST) {
            return textLoader;
        } else if (error) {
            return null;
        }
    }

    // TODO: This flag corresponds to diagram is invalid and code is being updated.
    const codeTriggerredUpdateInProgress = syntaxTree && isLoadingAST;

    // TODO: need to handle this when file is empty
    // AST node passed in to this is can be a top level node or a compilation unit.
    // const child = getSTComponent(syntaxTree); // TODO: Handle datamapper switching logic

    const dataMapperArgs = { ballerinaVersion, ...formConfig };

    // let hasConfigurable = false;
    // if (originalSyntaxTree) {
    //     hasConfigurable = hasConfigurables(originalSyntaxTree as ModulePart)
    // }

    return (
        <div id="canvas">
            {/* {(codeTriggerredUpdateInProgress || isMutationInProgress || isModulePullInProgress) && textLoader} */}
            <div className='container'>
                <div className={classes.DesignContainer}>
                    <LowCodeDiagram
                        syntaxTree={syntaxTree}
                        fullST={fullST}
                        isReadOnly={isReadOnly}
                        selectedPosition={selectedPosition}
                        zoomStatus={zoomStatus}
                        stSymbolInfo={stSymbolInfo}
                        experimentalEnabled={experimentalEnabled}
                        getListenerSignature={getListenerSignature}
                        api={{
                            edit: {
                                deleteComponent: handleDeleteComponent,
                                renderAddForm: handleDiagramAdd,
                                renderEditForm: handleDiagramEdit,
                                renderConnectorWizard: handleConnectorWizard,
                                renderDialogBox: handleRenderDialogBox,
                                closeAllOpenedForms: handleCloseAllOpenedForms,
                                renderPlusWidget: handleRenderPlusWidget,
                                openPerformanceChart: handleOpenPerformanceChart,
                                showTooltip: handleShowTooltip
                            },
                            code: {
                                gotoSource,
                                modifyDiagram,
                                getFunctionDef
                            },
                            webView: {
                                showTryitView
                            },
                            project: {
                                run
                            },
                            insights: {
                                onEvent
                            },
                            navigation
                        }}
                    />
                    {isFormOpen && !isDataMapperOpen && !isConnectorConfigWizardOpen && !isServiceDesignOpen && !isGraphQLViewOpen && (
                        <FormGenerator {...formConfig} />
                    )}
                    {isFormOpen && isDataMapperOpen && !isConnectorConfigWizardOpen && !isGraphQLViewOpen && (
                        <DataMapperOverlay
                            {...dataMapperArgs}
                        />
                    )}
                    {isFormOpen && isServiceDesignOpen && !isConnectorConfigWizardOpen && (
                        <ServiceDesignOverlay
                            {...formConfig}
                        />
                    )}
                    {isGraphQLViewOpen && (
                        <GraphqlDiagramOverlay
                            {...dataMapperArgs}
                            // tslint:disable-next-line: jsx-no-lambda no-empty
                            goToSource={() => { }}
                        />
                    )}
                    {!isFormOpen && isConnectorConfigWizardOpen && (
                        <ConnectorWizard {...connectorWizardProps} />
                    )}
                    {isDialogActive && activeDialog}
                </div>
            </div>
        </div>
    );
}
