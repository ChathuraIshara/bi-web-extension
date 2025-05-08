/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useReducer } from 'react';

import { FormControl } from '@material-ui/core';
import { ExpressionEditorProps } from '@wso2-enterprise/ballerina-expression-editor';
import { FormElementProps, getAllVariables, STModification } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import { FormActionButtons, FormHeaderSection } from '@wso2-enterprise/ballerina-low-code-edtior-ui-components';
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { ModuleVarDecl, NodePosition } from '@wso2-enterprise/syntax-tree';

import { Context } from '../../../../../Contexts/Diagram';
import {
    createModuleVarDecl,
    getAllModuleVariables,
    getVarNamePositionFromST,
    updateModuleVarDecl
} from '../../../../utils';
import { genVariableName } from '../../../Portals/utils';
import { useStyles as useFormStyles } from "../../DynamicConnectorForm/style";
import CheckBoxGroup from '../../FormFieldComponents/CheckBox';
import { LowCodeExpressionEditor } from "../../FormFieldComponents/LowCodeExpressionEditor";
import { TextLabel } from '../../FormFieldComponents/TextField/TextLabel';
import { isStatementEditorSupported } from "../../Utils";
import { VariableNameInput } from '../Components/VariableNameInput';
import { VariableTypeInput, VariableTypeInputProps } from '../Components/VariableTypeInput';

import { getFormConfigFromModel, isFormConfigValid, VariableOptions } from './util';
import { ModuleVarFormActionTypes, moduleVarFormReducer } from './util/reducer';


interface ModuleVariableFormProps {
    model?: ModuleVarDecl;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    formType: string;
    isLastMember?: boolean;
}

export function ModuleVariableForm(props: ModuleVariableFormProps) {
    const formClasses = useFormStyles();
    const {
        props: {
            ballerinaVersion,
            currentFile,
            fullST,
            importStatements,
            experimentalEnabled,
            stSymbolInfo,
            isCodeServerInstance
        },
        api: {
            code: {
                modifyDiagram,
                updateFileContent
            },
            ls: { getExpressionEditorLangClient },
            library,
            openExternalUrl
        },
    } = useContext(Context);
    const { onSave, onCancel, targetPosition, model, formType, isLastMember } = props;
    const [state, dispatch] = useReducer(moduleVarFormReducer, getFormConfigFromModel(model));

    const handleOnSave = () => {
        const modifications: STModification[] = []
        state.varName  = genVariableName(state.varName, getAllModuleVariables(stSymbolInfo));
        if (model) {
            modifications.push(updateModuleVarDecl(state, model.position));
        } else {
            modifications.push(createModuleVarDecl(state, targetPosition, isLastMember));
        }
        modifyDiagram(modifications);
        onSave();
    }

    const onAccessModifierChange = (modifierList: string[]) => {
        dispatch({ type: ModuleVarFormActionTypes.SET_VAR_OPTIONS, payload: modifierList });
        if (modifierList.indexOf('public') > -1 && state.varType === 'var') {
            // var type  cannot be public
            dispatch({ type: ModuleVarFormActionTypes.RESET_VARIABLE_TYPE });
        }
    }

    const onVarTypeChange = (type: string) => {
        dispatch({ type: ModuleVarFormActionTypes.SET_VAR_TYPE, payload: type });
    }

    const onValueChange = (value: string) => {
        dispatch({ type: ModuleVarFormActionTypes.SET_VAR_VALUE, payload: value });
    }

    const updateExpressionValidity = (fieldName: string, isInValid: boolean) => {
        dispatch({ type: ModuleVarFormActionTypes.UPDATE_EXPRESSION_VALIDITY, payload: !isInValid });
    }

    const handleOnVarNameChange = (value: string) => {
        dispatch({ type: ModuleVarFormActionTypes.SET_VAR_NAME, payload: value });
    }

    const expressionEditorConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "valueExpression",
            displayName: "Value Expression",
            typeName: state.varType,
            value: state.varValue,
        },
        customProps: {
            validate: updateExpressionValidity,
            interactive: true,
            statementType: state.varType,
            editPosition: {
                startLine: model ? model.position.startLine : targetPosition.startLine,
                endLine: model ? model.position.startLine : targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            },
            initialDiagnostics: model?.initializer?.typeData?.diagnostics,
        },
        onChange: onValueChange,
        defaultValue: state.varValue
    };

    const enableSaveBtn: boolean = isFormConfigValid(state);

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const formConfig = getFormConfigFromModel(model);
    const visibilityQualifier = formConfig.varOptions.includes(VariableOptions.PUBLIC) ? 'public' : '';
    const finalKeyword = formConfig.varOptions.includes(VariableOptions.FINAL) ? 'final' : '';
    const varType = formConfig.varType ? formConfig.varType : 'var';
    const varName = formConfig.varName ? formConfig.varName : genVariableName("variable",
        getAllVariables(stSymbolInfo));
    const varValue = formConfig.varValue;
    const initialSource = varValue ? `${visibilityQualifier} ${finalKeyword} ${varType} ${varName} = ${varValue};` :
                                     `${visibilityQualifier} ${finalKeyword} ${varType} ${varName};`;

    let namePosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 }

    if (model) {
        namePosition = getVarNamePositionFromST(model);
    } else {
        namePosition.startLine = targetPosition.startLine;
        namePosition.endLine = targetPosition.startLine;
    }

    const validateExpression = (fieldName: string, isInvalidType: boolean) => {
        updateExpressionValidity(fieldName, isInvalidType);
    };

    const variableTypeConfig: VariableTypeInputProps = {
        displayName: 'Select type',
        value: state.varType,
        onValueChange: onVarTypeChange,
        validateExpression,
        position: model ? {
            ...model.position,
            endLine: 0,
            endColumn: 0,
        } : targetPosition,
        overrideTemplate: {
            defaultCodeSnippet: `|()  tempVarType = ();`,
            targetColumn: 1
        }
    }

    const variableTypeInput = (
        <div className="exp-wrapper">
            <VariableTypeInput {...variableTypeConfig} />
        </div>
    );


    return (
        <>
            {statementEditorSupported ? (
                StatementEditorWrapper(
                    {
                        label: 'Variable',
                        initialSource,
                        formArgs: {formArgs: {
                                targetPosition: model ? targetPosition : {
                                    startLine: targetPosition.startLine, startColumn: targetPosition.startColumn
                                }
                            }},
                        config: { type: formType, model},
                        onWizardClose: onCancel,
                        onCancel,
                        currentFile,
                        getLangClient: getExpressionEditorLangClient,
                        applyModifications: modifyDiagram,
                        updateFileContent,
                        library,
                        syntaxTree: fullST,
                        stSymbolInfo,
                        importStatements,
                        experimentalEnabled,
                        isModuleVar: true,
                        ballerinaVersion,
                        isCodeServerInstance,
                        openExternalUrl
                    }
                )
            ) : (
                <FormControl data-testid="module-variable-config-form" className={formClasses.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={"lowcode.develop.configForms.ModuleVarDecl.title"}
                        defaultMessage={"Variables"}
                        formType={formType}
                    />
                    <div className={formClasses.formContentWrapper}>
                        <div className={formClasses.formNameWrapper}>
                            <TextLabel
                                textLabelId="lowcode.develop.configForms.ConstDecl.accessModifier"
                                defaultMessage="Access Modifier :"
                                required={true}
                            />
                            <CheckBoxGroup
                                values={['public', 'final']}
                                defaultValues={state.varOptions}
                                onChange={onAccessModifierChange}
                            />
                            {variableTypeInput}
                            <VariableNameInput
                                displayName={'Variable Name'}
                                value={state.varName}
                                onValueChange={handleOnVarNameChange}
                                validateExpression={updateExpressionValidity}
                                position={namePosition}
                                isEdit={!!model}
                                initialDiagnostics={model?.typedBindingPattern?.typeData?.diagnostics}
                            />
                            <LowCodeExpressionEditor
                                {...expressionEditorConfig}
                            />
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText="Save"
                        onSave={handleOnSave}
                        onCancel={onCancel}
                        validForm={enableSaveBtn}
                    />
                </FormControl>
            )}
        </>
    )
}
