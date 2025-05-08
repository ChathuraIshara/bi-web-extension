/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { FormControl } from "@material-ui/core";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import {
    FormElementProps
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    FormActionButtons,
    FormHeaderSection
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { FormEditor } from "@wso2-enterprise/ballerina-statement-editor";
import { ListenerDeclaration, NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../Contexts/Diagram";
import { createImportStatement, createListenerDeclartion } from "../../../../utils";
import { useStyles as useFormStyles } from "../../DynamicConnectorForm/style";
import { SelectDropdownWithButton } from "../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { LowCodeExpressionEditor } from "../../FormFieldComponents/LowCodeExpressionEditor";
import { TextLabel } from "../../FormFieldComponents/TextField/TextLabel";
import { isStatementEditorSupported } from "../../Utils";
import { VariableNameInput } from "../Components/VariableNameInput";

import { isListenerConfigValid } from "./util";
import { ListenerConfig } from "./util/types";

interface ListenerConfigFormProps {
    model?: ListenerDeclaration;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    formType?: string;
    isLastMember?: boolean
}

export function ListenerConfigForm(props: ListenerConfigFormProps) {
    const formClasses = useFormStyles();
    const { model, targetPosition, onCancel, onSave, formType, isLastMember } = props;
    const {
        api: {
            code: {
                modifyDiagram
            },
            ls: {
                getExpressionEditorLangClient
            }
        },
        props: {
            ballerinaVersion,
            currentFile
        },
    } = useDiagramContext();
    let defaultState: ListenerConfig;

    if (model && STKindChecker.isListenerDeclaration(model)
        && (STKindChecker.isImplicitNewExpression(model.initializer) || STKindChecker.isExplicitNewExpression(model.initializer))) {
        defaultState = {
            listenerName: model.variableName.value,
            listenerPort: model.initializer.parenthesizedArgList.arguments[0].source,
            listenerType: STKindChecker.isQualifiedNameReference(model.typeDescriptor)
                ? model.typeDescriptor.modulePrefix.value.toUpperCase()
                : "",
            isExpressionValid: true
        };
    } else {
        defaultState = {
            listenerName: '',
            listenerPort: '',
            listenerType: 'HTTP',
            isExpressionValid: false
        }
    }

    const [listenerName, setListenerName] = useState<string>(defaultState.listenerName);
    const [listenerPort, setListenerPort] = useState<string>(defaultState.listenerPort);
    const [listenerType, setListenerType] = useState<string>(defaultState.listenerType);
    const [isExpressionValid, setExpressionValid] = useState<boolean>(defaultState.isExpressionValid);

    const saveBtnEnabled = isListenerConfigValid({ listenerName, listenerPort, listenerType, isExpressionValid });

    const onListenerNameChange = (newName: string) => {
        setListenerName(newName);
    }

    const onListenerPortChange = (newPort: string) => {
        setListenerPort(newPort);
    }

    const handleOnSave = () => {
        let isNewListener: boolean;
        if (model) {
            isNewListener = false;
            const modelPosition = model.position as NodePosition;
            const updatePosition = {
                startLine: modelPosition.startLine,
                startColumn: 0,
                endLine: modelPosition.endLine,
                endColumn: modelPosition.endColumn
            };

            modifyDiagram([
                createListenerDeclartion(
                    { listenerName, listenerPort, listenerType, isExpressionValid },
                    updatePosition,
                    isNewListener
                )
            ]);
        } else {
            isNewListener = true;
            modifyDiagram([
                createImportStatement('ballerina', 'http', { startColumn: 0, startLine: 0 }),
                createListenerDeclartion({ listenerName, listenerPort, listenerType, isExpressionValid }, targetPosition, isNewListener, isLastMember)
            ]);
        }
        onSave();
    }

    const updateExpressionValidity = (fieldName: string, isInValid: boolean) => {
        setExpressionValid(!isInValid);
    }

    const portNumberExpressionEditorProps: FormElementProps<ExpressionEditorProps>  = {
        model: {
            name: "listenerPort",
            displayName: "Listener Port",
            typeName: "int",
            value: listenerPort
        },
        customProps: {
            validate: updateExpressionValidity,
            interactive: true,
            statementType: 'int',
            editPosition: {
                startLine: model ? model.position.startLine : targetPosition.startLine,
                endLine: model ? model.position.startLine : targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            },
            initialDiagnostics: model?.initializer?.typeData?.diagnostics
        },
        onChange: onListenerPortChange,
        defaultValue: listenerPort
    };

    const listenerPortInputComponent = (
        <LowCodeExpressionEditor
            {...portNumberExpressionEditorProps}
        />
    )

    let namePosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 }

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    if (model) {
        namePosition = model.variableName.position;
    } else {
        namePosition.startLine = targetPosition.startLine;
        namePosition.endLine = targetPosition.startLine;
    }

    return (
        <>
            {statementEditorSupported ? (
                <FormEditor
                    initialSource={model ? model.source : undefined}
                    initialModel={model}
                    targetPosition={model ? model?.position : targetPosition}
                    onCancel={onCancel}
                    type={"Listener"}
                    currentFile={currentFile}
                    getLangClient={getExpressionEditorLangClient}
                    applyModifications={modifyDiagram}
                    topLevelComponent={true} // todo: Remove this
                />
            ) : (
                <FormControl data-testid="listener-form" className={formClasses.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={"lowcode.develop.connectorForms.HTTP.title"}
                        defaultMessage={"Listener"}
                        formType={formType}
                    />
                    <div className={formClasses.formContentWrapper}>
                        <div className={formClasses.formNameWrapper}>
                            <TextLabel
                                required={true}
                                textLabelId="lowcode.develop.connectorForms.HTTP.listenerType"
                                defaultMessage="Listener Type :"
                            />
                            <SelectDropdownWithButton
                                customProps={{ values: ['HTTP'], disableCreateNew: true }}
                                defaultValue={listenerType}
                                placeholder="Select Type"
                            />
                            <VariableNameInput
                                displayName={'Listener Name'}
                                value={listenerName}
                                onValueChange={onListenerNameChange}
                                validateExpression={updateExpressionValidity}
                                position={namePosition}
                                isEdit={!!model}
                                initialDiagnostics={model?.variableName?.typeData?.diagnostics}
                            />
                            {listenerPortInputComponent}
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText="Save"
                        onSave={handleOnSave}
                        onCancel={onCancel}
                        validForm={saveBtnEnabled}
                    />
                </FormControl>
            )}
        </>
    )
}
