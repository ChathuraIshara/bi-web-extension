/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-wrap-multiline
import React, { useContext } from "react";

import { ConfigOverlayFormStatus, CustomExpressionConfig, LogConfig, LowcodeEvent, ProcessConfig, SAVE_STATEMENT, STModification, WorkerConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NamedWorkerDeclaration, NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import {
    createImportStatement,
    createLogStatement,
    createPropertyStatement,
    createWorker,
    updateLogStatement,
    updatePropertyStatement
} from "../../../../utils/modification-util";
import { DiagramOverlayPosition } from "../../../Portals/Overlay";
import { InjectableItem } from "../../FormGenerator";

import { ProcessForm } from "./ProcessForm";

export interface AddProcessFormProps {
    type: string;
    targetPosition: NodePosition;
    scopeSymbols?: string[];
    onCancel: () => void;
    onSave: () => void;
    model?: STNode;
    position: DiagramOverlayPosition;
    configOverlayFormStatus: ConfigOverlayFormStatus;
}

export function ProcessConfigForm(props: any) {
    const {
        api: {
            insights: { onEvent },
            code: {
                modifyDiagram,
            }
        },
        props: { stSymbolInfo }
    } = useContext(Context);

    const { onCancel, onSave, configOverlayFormStatus, targetPosition } = props as AddProcessFormProps;
    const { formArgs, formType, isLastMember } = configOverlayFormStatus;

    const processConfig: ProcessConfig = {
        type: formType,
        scopeSymbols: [],
        model: formArgs?.model,
        targetPosition,
    };

    const onSaveClick = () => {
        const modifications: STModification[] = [];
        if (formArgs?.expressionInjectables?.list) {
            formArgs.expressionInjectables.list.forEach((item: InjectableItem) => {
                modifications.push(item.modification)
            })
        }
        if (processConfig.model) {
            switch (processConfig.type) {
                case 'Variable':
                    const propertyConfig: string = processConfig.config as string;
                    const updatePropertyStmt: STModification = updatePropertyStatement(
                        propertyConfig, formArgs?.model.position
                    );
                    modifications.push(updatePropertyStmt);
                    break;
                case 'AssignmentStatement':
                    const assignmentConfig: string = processConfig.config as string;
                    const updateAssignmentStmt: STModification = updatePropertyStatement(
                        assignmentConfig, formArgs?.model.position
                    );
                    modifications.push(updateAssignmentStmt);
                    break;
                case 'Log':
                    const logConfig: LogConfig = processConfig.config as LogConfig;
                    const updateLogStmt: STModification = updateLogStatement(
                        logConfig.type, logConfig.expression, formArgs?.model.position
                    );
                    modifications.push(updateLogStmt);
                    break;
                case 'Worker':
                    const workerConfig: WorkerConfig = processConfig.config as WorkerConfig;
                    const model: NamedWorkerDeclaration = processConfig.model as NamedWorkerDeclaration;

                    const updateWorkerSignature: STModification = updatePropertyStatement(
                        `worker ${workerConfig.name} ${workerConfig.returnType.trim().length > 0 ? `returns ${workerConfig.returnType}` : ''}`,
                        {
                            startLine: model.position.startLine,
                            endLine: model.returnTypeDesc ?
                                model.returnTypeDesc.position.endLine : model.workerName.position.endLine,
                            startColumn: model.position.startColumn,
                            endColumn: model.returnTypeDesc ?
                                model.returnTypeDesc.position.endColumn : model.workerName.position.endColumn
                        }
                    );
                    modifications.push(updateWorkerSignature);
                    break;
                case 'Call':
                case 'Custom':
                default:
                    const customConfig: CustomExpressionConfig = processConfig.config as CustomExpressionConfig;
                    const editCustomStatement: STModification = updatePropertyStatement(customConfig.expression, formArgs?.model.position);
                    modifications.push(editCustomStatement);
                    break;
            }
        } else {
            const modificationPosition = formArgs?.targetPosition || targetPosition;
            if (modificationPosition) {
                // todo: make this ST modification
                if (processConfig.type === "Variable") {
                    const propertyConfig: string = processConfig.config as string;
                    const addPropertyStatement: STModification = createPropertyStatement(
                        propertyConfig, modificationPosition);
                    modifications.push(addPropertyStatement);
                } else if (processConfig.type === "AssignmentStatement") {
                    const assignmentConfig: string = processConfig.config as string;
                    const addAssignmentStatement: STModification = createPropertyStatement(
                        assignmentConfig, modificationPosition);
                    modifications.push(addAssignmentStatement);
                } else if (processConfig.type === "Log") {
                    const logConfig: LogConfig = processConfig.config as
                        LogConfig;
                    const addLogStatement: STModification = createLogStatement(
                        logConfig.type, logConfig.expression, modificationPosition);
                    const addImportStatement: STModification = createImportStatement(
                        "ballerina", "log", modificationPosition);
                    modifications.push(addImportStatement);
                    modifications.push(addLogStatement);
                } else if (processConfig.type === 'Worker') {
                    const workerConfig = processConfig.config as WorkerConfig;
                    const addWorkerDeclaration = createWorker(workerConfig.name, workerConfig.returnType, modificationPosition);
                    modifications.push(addWorkerDeclaration)
                } else if (processConfig.type === "Call" || processConfig.type === "Custom") {
                    const customConfig: CustomExpressionConfig = processConfig.config as CustomExpressionConfig;
                    const addCustomStatement: STModification = createPropertyStatement(customConfig.expression, modificationPosition, isLastMember);
                    modifications.push(addCustomStatement);
                }
                // const event: LowcodeEvent = {
                //     type: SAVE_STATEMENT,
                //     name: processConfig.type
                // };
                // onEvent(event);
            }
        }
        modifyDiagram(modifications);
        onSave()
    };

    return (
        <ProcessForm
            config={processConfig}
            onCancel={onCancel}
            onSave={onSaveClick}
            onWizardClose={onSave}
            configOverlayFormStatus={configOverlayFormStatus}
        />
    );
}
