/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { FormControl } from "@material-ui/core";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { FormEditor } from "@wso2-enterprise/ballerina-statement-editor";
import { NodePosition, ServiceDeclaration } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../Contexts/Diagram";
import { useStyles as useFormStyles } from "../../DynamicConnectorForm/style";
import { isStatementEditorSupported } from "../../Utils";

import { HttpServiceForm } from "./forms/HttpService";
import { TriggerServiceForm } from "./forms/TriggerService";
import { getServiceTypeFromModel } from "./util";

interface ServiceConfigFormProps {
    model?: ServiceDeclaration;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    formType: string;
    isLastMember?: boolean;
}

export enum ServiceTypes {
    HTTP = 'http',
    GRAPHQL = 'graphql'
}

export function ServiceConfigForm(props: ServiceConfigFormProps) {
    const formClasses = useFormStyles();
    const { model, targetPosition, onSave, onCancel, formType, isLastMember } = props;
    const {
        props: {
            currentFile,
            stSymbolInfo,
            ballerinaVersion,
            syntaxTree
        },
        api: {
            ls: {
                getExpressionEditorLangClient
            },
            code: {
                modifyDiagram
            }
        }
    } = useDiagramContext();
    const serviceType = getServiceTypeFromModel(model, stSymbolInfo);

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    let position: NodePosition;
    if (model) {
        const modelPosition = model.position as NodePosition;
        const openBracePosition = model.openBraceToken.position as NodePosition;
        position = {
            startLine: modelPosition.startLine,
            startColumn: 0,
            endLine: openBracePosition.startLine,
            endColumn: openBracePosition.startColumn - 1
        };
    } else {
        position = targetPosition;
    }

    let configForm;
    if (((serviceType === ServiceTypes.HTTP) || (serviceType === undefined)) && !statementEditorSupported) {
        // Loading previous HTTP forms when trigger type is HTTP or service type is empty(Inserting a service)
        configForm = (
            <FormControl data-testid="service-config-form" className={formClasses.wizardFormControl}>
                <FormHeaderSection
                    onCancel={onCancel}
                    formTitle={"lowcode.develop.configForms.ServiceConfigForm.title"}
                    defaultMessage={"Service"}
                    formType={formType}
                />
                <HttpServiceForm
                    onSave={onSave}
                    onCancel={onCancel}
                    model={model}
                    targetPosition={targetPosition}
                    isLastMember={isLastMember}
                />
            </FormControl>
        )
    } else if ((serviceType !== ServiceTypes.HTTP && serviceType !== ServiceTypes.GRAPHQL) && model) {
        // Loading triggers in a service editing scenario when the service type is not HTTP
        configForm = (
            <FormControl data-testid="service-config-form" className={formClasses.wizardFormControl}>
                <FormHeaderSection
                    onCancel={onCancel}
                    formTitle={"lowcode.develop.configForms.ServiceConfigForm.title"}
                    defaultMessage={"Service"}
                    formType={formType}
                />
                <div className={formClasses.formContentWrapper}>
                    <TriggerServiceForm onSave={onSave} onCancel={onCancel} model={model} targetPosition={targetPosition} />
                </div>
            </FormControl>
        )
    } else {
        // Loading statement editor form in other cases
        configForm = (
            <FormEditor
                initialSource={model ? model.source : undefined}
                initialModel={model}
                targetPosition={position}
                stSymbolInfo={stSymbolInfo}
                syntaxTree={syntaxTree}
                isLastMember={isLastMember}
                onCancel={onCancel}
                type={"Service"}
                currentFile={currentFile}
                getLangClient={getExpressionEditorLangClient}
                applyModifications={modifyDiagram}
                topLevelComponent={true}// todo: Remove this
            />
        )
    }

    return (
        <>
            {configForm}
        </>
    )
}
