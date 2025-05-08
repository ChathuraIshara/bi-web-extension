/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useEffect, useRef, useState } from "react";

import { Button, Divider, FormControl } from "@material-ui/core";
import { ConfigOverlayFormStatus, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { FormEditor } from "@wso2-enterprise/ballerina-statement-editor";
import { FunctionDefinition, NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { AddIcon } from "../../../../../assets/icons";
import { Section } from "../../../../../components/ConfigPanel";
import { useDiagramContext } from "../../../../../Contexts/Diagram";
import {
    createFunctionSignature,
    updateFunctionSignature,
} from "../../../../utils";
import { useStyles as useFormStyles } from "../../DynamicConnectorForm/style";
import { isStatementEditorSupported } from "../../Utils";
import { VariableNameInput, VariableNameInputProps } from "../Components/VariableNameInput";
import { VariableTypeInput, VariableTypeInputProps } from "../Components/VariableTypeInput";
import { recalculateItemIds } from "../ResourceConfigForm/ApiConfigureWizard/util";

import { FunctionParamItem } from "./FunctionParamEditor/FunctionParamItem";
import { FunctionParamSegmentEditor } from "./FunctionParamEditor/FunctionSegmentEditor";
import { FunctionParam } from "./types";

interface FunctionConfigFormProps {
    model?: FunctionDefinition;
    configOverlayFormStatus?: ConfigOverlayFormStatus;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    isLastMember?: boolean;
}

export function FunctionConfigForm(props: FunctionConfigFormProps) {
    const MAIN_TEXT: string = "Main";
    const formClasses = useFormStyles();
    const { targetPosition, model, onSave, onCancel, configOverlayFormStatus, isLastMember } = props;
    const isMainFunction: boolean = (configOverlayFormStatus.formName && configOverlayFormStatus.formName === MAIN_TEXT) || (model && model.functionName.value === MAIN_TEXT.toLowerCase());
    const [functionName, setFunctionName] = useState(isMainFunction ? MAIN_TEXT.toLowerCase() : "");
    const [parameters, setParameters] = useState<FunctionParam[]>([]);
    const [returnType, setReturnType] = useState(model ? model?.functionSignature?.returnTypeDesc?.type?.source : "error?");
    const [validReturnType, setValidReturnType] = useState(false)
    const [addingNewParam, setAddingNewParam] = useState(false);
    const [isFunctionNameValid, setIsFunctionNameValid] = useState(false);
    // editingSegmentId > -1 when editing
    const [editingSegmentId, setEditingSegmentId] = useState<number>(-1);

    const {
        props: { fullST, ballerinaVersion, currentFile },
        api: {
            ls: { getExpressionEditorLangClient },
            code: { modifyDiagram }
        }
    } = useDiagramContext();
    const existingFunctionNames = useRef([]);

    const handleOnEdit = (funcParam: FunctionParam) => {
        const id = parameters.findIndex(param => param.id === funcParam.id);
        // Once edit is clicked
        if (id > -1) {
            setEditingSegmentId(id);
        }
        setAddingNewParam(false);
    };

    const handleOnSave = () => {
        const parametersStr = parameters
            .map((item) => `${item.type} ${item.name}`)
            .join(",");

        const returnTypeStr = returnType ? `returns ${returnType}` : "";

        const modifications: STModification[] = [];
        if (model && STKindChecker.isFunctionDefinition(model)) {
            // Perform update if model exists
            modifications.push(
                updateFunctionSignature(
                    functionName,
                    parametersStr,
                    returnTypeStr,
                    {
                        ...model?.functionSignature?.position,
                        startColumn: model?.functionName?.position?.startColumn,
                    }
                )
            );
        } else {
            // Create new function if model does not exist
            modifications.push(
                createFunctionSignature(
                    isMainFunction ? "public" : "",
                    functionName,
                    parametersStr,
                    returnTypeStr,
                    targetPosition,
                    isLastMember
                )
            );
        }
        modifyDiagram(modifications);
        onSave();
    };

    const updateFunctionNameValidation = (fieldName: string, isInValid: boolean) => {
        setIsFunctionNameValid(!isInValid);
    }

    const onFunctionNameChange = (name: string) => {
        setFunctionName(name)
    };

    // Param related functions
    const openNewParamView = () => {
        setAddingNewParam(true);
        setEditingSegmentId(-1);
    };
    const closeNewParamView = () => {
        setAddingNewParam(false);
        setEditingSegmentId(-1);
    };
    const handleOnUpdateParam = (param: FunctionParam) => {
        const id = param.id;
        if (id > -1) {
            parameters[id] = param;
            setParameters(parameters);
        }
        setAddingNewParam(false);
        setEditingSegmentId(-1);
    };
    const onSaveNewParam = (param: FunctionParam) => {
        setParameters([...parameters, param]);
        setAddingNewParam(false);
        setEditingSegmentId(-1);
    };
    const onDeleteParam = (paramItem: FunctionParam) => {
        setParameters(parameters.filter((item) => item.id !== paramItem.id));
        recalculateItemIds(parameters);
    }

    useEffect(() => {
        // Getting all function names for function name validation
        existingFunctionNames.current = (fullST as any)
            .members?.filter((member: any) => STKindChecker.isFunctionDefinition(member))
            .map((member: any) => member.functionName.value);

        if (model && STKindChecker.isFunctionDefinition(model)) {
            // Populating field values if trying to edit
            existingFunctionNames.current = existingFunctionNames?.current?.filter(
                (name) => name !== model.functionName.value
            );
            setFunctionName(model.functionName.value);
            const editParams: FunctionParam[] = model.functionSignature.parameters
                .filter((param) => STKindChecker.isRequiredParam(param))
                .map((param: any, index) => ({
                    id: index,
                    name: param.paramName.value,
                    type: param.typeName.source.trim(),
                }));
            setParameters(editParams);
        }
    }, [model]);

    let namePosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 };
    let returnPosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 };
    let paramPosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 };

    if (model) {
        namePosition = model.functionName.position;

        if (model?.functionSignature?.returnTypeDesc) {
            returnPosition = model?.functionSignature?.returnTypeDesc?.position;
        } else {
            returnPosition = {
                ...model?.functionSignature?.closeParenToken?.position,
                startColumn: model?.functionSignature?.closeParenToken?.position?.startColumn + 1,
            }
        }

        paramPosition = {
            ...model?.functionSignature?.openParenToken?.position,
            startColumn: model?.functionSignature?.openParenToken?.position.startColumn
        };
    } else {
        namePosition.startLine = targetPosition.startLine;
        namePosition.endLine = targetPosition.startLine;

        returnPosition.startLine = targetPosition.startLine;
        returnPosition.endLine = targetPosition.startLine;

        paramPosition = {
            ...targetPosition,
            endLine: targetPosition.startLine,
            endColumn: targetPosition.startColumn,
        };
    }

    const functionNameConfig: VariableNameInputProps = {
        displayName: 'Function Name',
        value: model ? model.functionName.value : functionName,
        onValueChange: onFunctionNameChange,
        validateExpression: updateFunctionNameValidation,
        position: namePosition,
        isEdit: !!model,
        disabled: isMainFunction,
        overrideTemplate: {
            defaultCodeSnippet: 'function () {}',
            targetColumn: 10
        }
    }

    const validateParams = (value: string) => {
        const isParamExist = parameters.some((item) => item.name === value);
        return {
            error: isParamExist,
            message: isParamExist ? `${value} already exists` : "",
        };
    };

    const validateReturnType = (fieldName: string, isInvalid: boolean) => {
        setValidReturnType(!isInvalid);
    };

    const returnTypeConfig: VariableTypeInputProps = {
        displayName: 'Return Type',
        hideLabel: true,
        value: returnType,
        onValueChange: setReturnType,
        validateExpression: validateReturnType,
        position: returnPosition,
        overrideTemplate: model ? {
            defaultCodeSnippet: returnType ? 'returns ' : '',
            targetColumn: returnType ? 9 : 0
        } : {
            defaultCodeSnippet: 'function temp_function() returns  {}',
            targetColumn: 34
        },
        initialDiagnostics: model?.functionSignature?.returnTypeDesc?.typeData?.diagnostics,
    }

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const isValidReturnType = returnType ? validReturnType : true;
    const paramElements: React.ReactElement[] = [];
    parameters.forEach((value, index) => {
        if (value.name) {
            if (editingSegmentId !== index) {
                paramElements.push(
                    <FunctionParamItem
                        key={index}
                        functionParam={value}
                        addInProgress={addingNewParam}
                        onDelete={onDeleteParam}
                        onEditClick={handleOnEdit}
                    />
                );
            } else if (editingSegmentId === index) {
                paramElements.push(
                    <FunctionParamSegmentEditor
                        id={editingSegmentId}
                        segment={value}
                        onCancel={closeNewParamView}
                        onUpdate={handleOnUpdateParam}
                        validateParams={validateParams}
                        position={paramPosition}
                        isEdit={!!model}
                        paramCount={parameters.length}
                    />
                );
            }
        }
    });
    return (
        <>
            {statementEditorSupported ? (
                <FormEditor
                    initialSource={model ? model.source : undefined}
                    initialModel={model}
                    isLastMember={isLastMember}
                    targetPosition={model ? model?.functionSignature?.position : targetPosition}
                    onCancel={onCancel}
                    type={isMainFunction ? MAIN_TEXT : "Function"}
                    currentFile={currentFile}
                    getLangClient={getExpressionEditorLangClient}
                    applyModifications={modifyDiagram}
                    topLevelComponent={true} // todo: Remove this
                />
            ) : (
                <FormControl data-testid="function-form" className={formClasses.wizardFormControl}  >
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={"lowcode.develop.configForms.functionForms.title"}
                        defaultMessage={"Function"}
                    />
                    <div className={formClasses.formContentWrapper}>
                        <div className={formClasses.formNameWrapper}>
                            <VariableNameInput {...functionNameConfig} />
                            <Divider className={formClasses.sectionSeperatorHR} />
                            <Section title={"Parameters"}>
                                {paramElements}
                                {addingNewParam ? (
                                    <FunctionParamSegmentEditor
                                        id={parameters.length}
                                        onCancel={closeNewParamView}
                                        onSave={onSaveNewParam}
                                        validateParams={validateParams}
                                        position={paramPosition}
                                        isEdit={!!model}
                                        paramCount={parameters.length}
                                    />
                                ) : (
                                    <Button
                                        onClick={openNewParamView}
                                        className={formClasses.addParameterBtn}
                                        startIcon={<AddIcon />}
                                        color="primary"
                                    >
                                        Add parameter
                                    </Button>
                                )}
                            </Section>
                            <Divider className={formClasses.sectionSeperatorHR} />
                            <Section title={"Return Type"}>
                                <VariableTypeInput {...returnTypeConfig} />
                            </Section>
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText="Save"
                        onSave={handleOnSave}
                        onCancel={onCancel}
                        validForm={(functionName.length > 0) && (isMainFunction || isFunctionNameValid)
                            && !addingNewParam && isValidReturnType}
                    />
                </FormControl>
            )}
        </>
    );
}
