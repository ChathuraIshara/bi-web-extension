/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormControl, Typography } from "@material-ui/core";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import { getAllVariables, ProcessConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { LocalVarDecl, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../Contexts/Diagram";
import {
    createModuleVarDecl,
    createModuleVarDeclWithoutInitialization,
    getInitialSource,
    getVariableNameFromST,
    getVarNamePositionFromST
} from "../../../../../../utils";
import { genVariableName } from "../../../../../Portals/utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { SwitchToggle } from "../../../../FormFieldComponents/SwitchToggle";
import { FormElementProps } from "../../../../Types";
import { isStatementEditorSupported } from "../../../../Utils";
import { VariableNameInput, VariableNameInputProps } from "../../../Components/VariableNameInput";
import {
    VariableTypeInput,
    VariableTypeInputProps
} from "../../../Components/VariableTypeInput";

interface AddVariableConfigProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

// FIXME: remove variableTypes array once its references are removed from other places
export const variableTypes: string[] = ["var", "int", "float", "decimal", "boolean", "string", "json",
    "xml", "error", "any", "anydata", "other"];

export function AddVariableConfig(props: AddVariableConfigProps) {
    const classes = useStyles();
    const intl = useIntl();
    const { config, formArgs, onCancel, onSave, onWizardClose } = props;

    const {
        props: {
            ballerinaVersion,
            currentFile,
            isMutationProgress: isMutationInProgress,
            stSymbolInfo,
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
        },
    } = useContext(Context);

    let initialModelType: string = '';
    let variableName: string = '';
    let varExpression: string = '';
    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);
    let initializedState;

    const existingProperty = config && config.model;
    if (existingProperty && STKindChecker.isLocalVarDecl(config.model)) {
        const localVarDec: LocalVarDecl = config.model as LocalVarDecl;
        const typeDescriptor = localVarDec.typedBindingPattern.typeDescriptor;
        // tslint:disable-next-line:prefer-conditional-expression
        if (STKindChecker.isIntTypeDesc(typeDescriptor) || STKindChecker.isFloatTypeDesc(typeDescriptor) ||
            STKindChecker.isDecimalTypeDesc(typeDescriptor) || STKindChecker.isBooleanTypeDesc(typeDescriptor) ||
            STKindChecker.isStringTypeDesc(typeDescriptor) || STKindChecker.isJsonTypeDesc(typeDescriptor) ||
            STKindChecker.isVarTypeDesc(typeDescriptor) || STKindChecker.isAnyTypeDesc(typeDescriptor) ||
            STKindChecker.isAnydataTypeDesc(typeDescriptor)) {
            initialModelType = typeDescriptor.name.value;
        } else {
            initialModelType = typeDescriptor.source.trim();
        }
        variableName = getVariableNameFromST(config?.model);
        varExpression = localVarDec?.initializer?.source || '';
        initializedState = localVarDec?.initializer ? true : false;
    } else {
        variableName = '';
        varExpression = '';
        initializedState = true;
    }

    const [selectedType, setSelectedType] = useState(initialModelType);
    const [varName, setVarName] = useState(variableName);
    const [variableExpression, setVariableExpression] = useState<string>(varExpression);
    const [initialized, setIsInitialized] = useState<boolean>(initializedState);

    const onPropertyChange = (property: string) => {
        setVariableExpression(property);
    };

    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        // TODO Implement when validations are re-enabled
    };

    const validateVarName = (fieldName: string, isInvalid: boolean) => {
        // TODO Implement when validations are re-enabled
    };

    const validateVarType = (fieldName: string, isInvalid: boolean) => {
        // TODO Implement when validations are re-enabled
    };

    const handleSave = () => {
        if (initialized) {
            if (variableExpression) {
                config.config = selectedType + " " + varName + " = " + variableExpression + ";";
                onSave();
            }
        } else {
            config.config = selectedType + " " + varName + ";";
            onSave();
        }
    };

    const saveVariableButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.variable.saveButton.text",
        defaultMessage: "Save"
    });

    const cancelVariableButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.variable.cancelButton.text",
        defaultMessage: "Cancel"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.variable.title",
        defaultMessage: "Variable"
    });

    const variableTooltipMessages = {
        customVariableType: {
            title: intl.formatMessage({
                id: "lowcode.develop.configForms.variable.customVariableType.tooltip.title",
                defaultMessage: "Enter the variable type."
            })
        },
        expressionEditor: {
            title: intl.formatMessage({
                id: "lowcode.develop.configForms.variable.expressionEditor.tooltip.title",
                defaultMessage: "Press CTRL+Spacebar for suggestions."
            }),
            actionText: intl.formatMessage({
                id: "lowcode.develop.configForms.variable.expressionEditor.tooltip.actionText",
                defaultMessage: "Learn about Ballerina expressions here"
            }),
            actionLink: intl.formatMessage({
                id: "lowcode.develop.configForms.variable.expressionEditor.tooltip.actionTitle",
                defaultMessage: "{learnBallerina}"
            }, { learnBallerina: "https://ballerina.io/1.2/learn/by-example/variables.html?is_ref_by_example=true" })
        }
    };


    const validForm: boolean = initialized
        ? varName.length > 0 && variableExpression?.length > 0 && selectedType.length > 0
        : varName.length > 0 && selectedType.length > 0;

    const variableTypeConfig: VariableTypeInputProps = {
        displayName: 'Variable Type',
        value: selectedType,
        onValueChange: setSelectedType,
        validateExpression: validateVarType,
        position: config.model ? {
            ...(config.model as LocalVarDecl).typedBindingPattern.position,
            endLine: (config.model as LocalVarDecl).typedBindingPattern.position.startLine,
            endColumn: (config.model as LocalVarDecl).typedBindingPattern.position.startColumn,
        } : formArgs.targetPosition,
        initialDiagnostics: (config.model as LocalVarDecl)?.typedBindingPattern?.typeDescriptor?.typeData?.diagnostics
    }

    const variableNameConfig: VariableNameInputProps = {
        displayName: 'Variable Name',
        value: varName,
        onValueChange: setVarName,
        validateExpression: validateVarName,
        position: config.model ?
            getVarNamePositionFromST(config?.model as LocalVarDecl)
            : formArgs.targetPosition,
        isEdit: !!config.model,
        initialDiagnostics: (config.model as LocalVarDecl)?.typedBindingPattern?.bindingPattern?.typeData?.diagnostics
    }

    const expressionEditorConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "Expression",
            displayName: "Value Expression",
            typeName: selectedType || 'any|error',
            value: variableExpression,
        },
        customProps: {
            validate: validateExpression,
            statementType: selectedType,
            interactive: true,
            tooltipTitle: variableTooltipMessages.expressionEditor.title,
            tooltipActionText: variableTooltipMessages.expressionEditor.actionText,
            tooltipActionLink: variableTooltipMessages.expressionEditor.actionLink,
            expressionInjectables: {
                list: formArgs?.expressionInjectables?.list,
                setInjectables: formArgs?.expressionInjectables?.setInjectables
            },
            editPosition: config.model ? {
                ...config.model?.position,
                endLine: config.model.position.startLine,
                endColumn: config.model.position.startColumn,
            } : formArgs.targetPosition,
            initialDiagnostics: (config.model as LocalVarDecl)?.initializer?.typeData?.diagnostics,
            changed: selectedType
        },
        onChange: onPropertyChange,
        defaultValue: variableExpression,
    };

    const initialSource = initialized ? (
            getInitialSource(createModuleVarDecl(
                {
                    varName: varName ? varName : genVariableName("variable", getAllVariables(stSymbolInfo)),
                    varOptions: [],
                    varType: selectedType ? selectedType : "var",
                    varValue: variableExpression ? variableExpression : "EXPRESSION"
                }
            ))
        ) :
        (
            getInitialSource(createModuleVarDeclWithoutInitialization(
                {
                    varName: varName ? varName : genVariableName("variable", getAllVariables(stSymbolInfo)),
                    varOptions: [],
                    varType: selectedType ? selectedType : "var",
                    varValue: null
                }
            ))
        );

    const variableTypeInput = (
        <div className="exp-wrapper">
            <VariableTypeInput {...variableTypeConfig} />
        </div>
    );

    const variableNameInput = (
        <div className="exp-wrapper">
            <VariableNameInput {...variableNameConfig} />
        </div>
    );

    const expressionEditor = (
        <div className="exp-wrapper">
            <LowCodeExpressionEditor
                {...expressionEditorConfig}
            />
        </div>
    );

    const handleVarInitialize = () => {
        setIsInitialized(!initialized);
    };

    const initializedToggle = (
        <div className={classes.toggle}>
            <Typography variant="body1">
                <FormattedMessage
                    id="lowcode.develop.configForms.variable.initialize.button"
                    defaultMessage="Initialize Variable"
                />
            </Typography>
            <SwitchToggle onChange={handleVarInitialize} initSwitch={initialized} dataTestId={"initialize-varible"}  />
        </div>
    );

    return (
        <>
            {statementEditorSupported ? (
                StatementEditorWrapper(
                    {
                        label: formTitle,
                        initialSource,
                        formArgs: { formArgs },
                        config,
                        onWizardClose,
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
                        ballerinaVersion,
                        isCodeServerInstance,
                        openExternalUrl
                    }
                )
            ) : (
                <FormControl data-testid="property-form" className={classes.wizardFormControlExtended}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Variable"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formDeclarationWrapper}>
                            <div className={classes.formNameNValueWrapper}>
                                {variableTypeInput}
                            </div>
                            <div className={classes.formNameNValueWrapper}>
                                {variableNameInput}
                            </div>
                        </div>
                        <div className={classes.formEqualWrapper}>
                            {
                                initialized && (
                                    <div className={classes.formEqualContainer}>
                                        <div className={classes.equalContainer}>
                                            <Typography variant='body2'>=</Typography>
                                        </div>
                                        <div className={classes.valueContainer}>
                                            {expressionEditor}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        {initializedToggle}
                    </div>
                    <FormActionButtons
                        cancelBtnText={cancelVariableButtonText}
                        cancelBtn={true}
                        saveBtnText={saveVariableButtonText}
                        isMutationInProgress={isMutationInProgress}
                        validForm={validForm}
                        onSave={handleSave}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    )
}
