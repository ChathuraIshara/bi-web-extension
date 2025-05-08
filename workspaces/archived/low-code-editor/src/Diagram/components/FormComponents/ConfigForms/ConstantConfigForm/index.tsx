/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useReducer, useState } from "react"

import { FormControl } from "@material-ui/core";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import {
    FormElementProps,
    STModification
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    FormActionButtons,
    FormHeaderSection
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { ConstDeclaration, NodePosition } from "@wso2-enterprise/syntax-tree"
import { v4 as uuid } from 'uuid';

import { Context } from "../../../../../Contexts/Diagram";
import { createConstDeclaration, updateConstDeclaration } from "../../../../utils";
import { useStyles as useFormStyles } from "../../DynamicConnectorForm/style";
import CheckBoxGroup from "../../FormFieldComponents/CheckBox";
import { SelectDropdownWithButton } from "../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { LowCodeExpressionEditor } from "../../FormFieldComponents/LowCodeExpressionEditor";
import { TextLabel } from "../../FormFieldComponents/TextField/TextLabel";
import { isStatementEditorSupported } from "../../Utils";
import { VariableNameInput } from "../Components/VariableNameInput";

import { generateConfigFromModel, isFormConfigValid } from "./util";
import { ConstantConfigFormActionTypes, constantConfigFormReducer } from "./util/reducer";

interface ConstantConfigFormProps {
    model?: ConstDeclaration;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    formType: string;
}

export function ConstantConfigForm(props: ConstantConfigFormProps) {
    const formClasses = useFormStyles();
    const {
        props: {
            ballerinaVersion,
            stSymbolInfo,
            currentFile,
            fullST,
            importStatements,
            experimentalEnabled,
            isCodeServerInstance
        },
        api: {
            ls: { getExpressionEditorLangClient },
            code: {
                modifyDiagram,
                updateFileContent
            },
            library,
            openExternalUrl
        }
    } = useContext(Context);
    const { model, targetPosition, onCancel, onSave, formType } = props;
    const [config, dispatch] = useReducer(constantConfigFormReducer, generateConfigFromModel(model));
    const variableTypes: string[] = ["int", "float", "byte", "boolean", "string"];
    const [focus, setFocus] = useState(false)
    const [uniqueId] = useState(uuid());

    const updateExpressionValidity = (fieldName: string, isInValid: boolean) => {
        dispatch({ type: ConstantConfigFormActionTypes.UPDATE_EXPRESSION_VALIDITY, paylaod: !isInValid });
    }

    const handleTypeEnableToggle = () => {
        dispatch({ type: ConstantConfigFormActionTypes.TOGGLE_INCLUDE_TYPE });
    }

    const handleAccessModifierChange = () => {
        dispatch({ type: ConstantConfigFormActionTypes.TOGGLE_ACCESS_MODIFIER });
    }

    const handleTypeChange = (type: string) => {
        dispatch({ type: ConstantConfigFormActionTypes.SET_CONSTANT_TYPE, payload: type });
        setFocus(true);
    }

    const handleNameChange = (name: string) => {
        dispatch({ type: ConstantConfigFormActionTypes.SET_CONSTANT_NAME, payload: name })
    }

    const handleValueChange = (value: string) => {
        dispatch({ type: ConstantConfigFormActionTypes.SET_CONSTANT_VALUE, payload: value })
    }
    const revertFocus = () => {
        setFocus(false)
    }

    const expressionEditorConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "valueExpression",
            displayName: "Value Expression",
            typeName: config.isTypeDefined ? config.constantType : undefined,
            value: config.constantValue
        },
        customProps: {
            validate: updateExpressionValidity,
            interactive: true,
            statementType: config.isTypeDefined ? config.constantType : undefined,
            editPosition: {
                startLine: model ? model.position.startLine : targetPosition.startLine,
                endLine: model ? model.position.startLine : targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            },
            customTemplate: config.isTypeDefined ? undefined : {
                defaultCodeSnippet: `const temp_var_${uniqueId.replaceAll('-', '_')} = ;`,
                targetColumn: 54,
            },
            initialDiagnostics: model?.initializer?.typeData?.diagnostics,
            focus,
            revertFocus
        },
        onChange: handleValueChange,
        defaultValue: config.constantValue
    };

    const typeSelectorCustomProps = {
        disableCreateNew: true,
        values: variableTypes
    };

    const typeSelector = (
        <SelectDropdownWithButton
            defaultValue={config.constantType}
            customProps={typeSelectorCustomProps}
            label={"Select type"}
            onChange={handleTypeChange}
        />
    );

    const handleOnSave = () => {
        const modifications: STModification[] = [];

        if (model) {
            modifications.push(updateConstDeclaration(config, model.position));
        } else {
            modifications.push(createConstDeclaration(config, targetPosition));
        }

        modifyDiagram(modifications);
        onSave();
    }
    const constantConfig = generateConfigFromModel(model);
    const visibilityQualifier = constantConfig.isPublic ? 'public' : '';
    const varType = constantConfig.constantType;
    const varName = constantConfig.constantName ? constantConfig.constantName : 'CONST_NAME';
    const varValue = constantConfig.constantValue ? constantConfig.constantValue : 'EXPRESSION';
    const enableSaveBtn: boolean = isFormConfigValid(config);
    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);
    const initialSource = `${visibilityQualifier} const ${varType} ${varName} = ${varValue};`;
    let namePosition: NodePosition = { startLine: 0, startColumn: 0, endLine: 0, endColumn: 0 }

    if (model) {
        namePosition = model.variableName.position;
    } else {
        namePosition.startLine = targetPosition.startLine;
        namePosition.endLine = targetPosition.startLine;
    }

    return (
        <>
            {statementEditorSupported ? (
                StatementEditorWrapper(
                    {
                        label: 'Constant',
                        initialSource,
                        formArgs: {formArgs: {
                                targetPosition: model ? targetPosition : { startLine: targetPosition.startLine, startColumn: targetPosition.startColumn }
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
                        formTitle={"lowcode.develop.configForms.ConstDecl.title"}
                        defaultMessage={"Constant"}
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
                                values={["public"]}
                                defaultValues={config.isPublic ? ["public"] : []}
                                onChange={handleAccessModifierChange}
                            />
                            <VariableNameInput
                                displayName={"Constant Name"}
                                value={config.constantName}
                                onValueChange={handleNameChange}
                                validateExpression={updateExpressionValidity}
                                position={namePosition}
                                isEdit={!!model}
                                initialDiagnostics={model?.variableName?.typeData?.diagnostics}
                            />
                            <CheckBoxGroup
                                values={["Include type in declaration"]}
                                defaultValues={config.isTypeDefined ? ["Include type in declaration"] : []}
                                onChange={handleTypeEnableToggle}
                            />
                            {config.isTypeDefined && typeSelector}
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
