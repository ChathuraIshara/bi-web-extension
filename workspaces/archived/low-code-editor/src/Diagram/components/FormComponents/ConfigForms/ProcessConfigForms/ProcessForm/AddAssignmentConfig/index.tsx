/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";

import { FormControl, Typography } from "@material-ui/core";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import { FormElementProps, ProcessConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { AssignmentStatement, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../Contexts/Diagram";
import { createPropertyStatement, getInitialSource } from "../../../../../../utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { isStatementEditorSupported } from "../../../../Utils";

interface AddAssignmentConfigProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddAssignmentConfig(props: AddAssignmentConfigProps) {
    const classes = useStyles();
    const intl = useIntl();
    const { config, formArgs, onCancel, onSave, onWizardClose } = props;

    const {
        props: {
            ballerinaVersion,
            isMutationProgress: isMutationInProgress,
            currentFile,
            fullST,
            stSymbolInfo,
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

    let variableName: string = '';
    let varExpression: string = '';

    const existingProperty = config && config.model;
    if (existingProperty && STKindChecker.isAssignmentStatement(config.model)) {
        varExpression = config.model.expression?.source;
        variableName = config.model?.varRef?.source?.trim();
    }

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const [varName, setVarName] = useState(variableName);
    const [validName, setValidName] = useState(false);
    const [variableExpression, setVariableExpression] = useState<string>(varExpression);
    const [validExpression, setValidExpression] = useState(false);

    const onPropertyChange = (property: string) => {
        setVariableExpression(property);
    };

    const validateExpressionName = (fieldName: string, isInvalid: boolean) => {
        setValidName(!isInvalid);
    };

    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        setValidExpression(!isInvalid);
    };

    const handleSave = () => {
        if (variableExpression) {
            config.config = `${varName} = ${variableExpression};`;
            onSave();
        }
    };

    const saveVariableButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.assignment.saveButton.text",
        defaultMessage: "Save"
    });

    const cancelVariableButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.assignment.cancelButton.text",
        defaultMessage: "Cancel"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.assignment.title",
        defaultMessage: "Assignment"
    });

    const validForm: boolean = varName.length > 0 && variableExpression.length > 0;

    const nameExpressionEditorConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "variableName",
            displayName: "Variable Name",
            isOptional: false,
        },
        customProps: {
            validate: validateExpressionName,
            interactive: true,
            editPosition: config?.model?.position || formArgs.targetPosition,
            hideExpand: true,
            customTemplate: {
                defaultCodeSnippet: `any|error tempAssignment = ;`,
                targetColumn: 28,
            },
            initialDiagnostics: (config.model as AssignmentStatement)?.varRef?.typeData?.diagnostics
        },
        onChange: setVarName,
        defaultValue: varName
    };

    const expressionEditorConfig: FormElementProps<ExpressionEditorProps> = {
        model: {
            name: "Expression",
            displayName: "Value Expression",
            value: variableExpression,
        },
        customProps: {
            validate: validateExpression,
            interactive: true,
            statementType: varName,
            expressionInjectables: {
                list: formArgs?.expressionInjectables?.list,
                setInjectables: formArgs?.expressionInjectables?.setInjectables
            },
            editPosition: config?.model?.position || formArgs.targetPosition,
            customTemplate: {
                defaultCodeSnippet: `${varName || 'any|error assignment'} = ;`,
                targetColumn: varName ? (varName.length + 3) : 24
            },
            changed: varName,
            initialDiagnostics: (config.model as AssignmentStatement)?.expression?.typeData?.diagnostics
        },
        onChange: onPropertyChange,
        defaultValue: variableExpression
    };

    const initialSource = getInitialSource(createPropertyStatement(
        `${varName ? varName : "default"} = ${variableExpression ? variableExpression : "EXPRESSION"} ;`
    ));

    const nameExpressionEditor = (
        <div className="exp-wrapper">
            <LowCodeExpressionEditor
                {...nameExpressionEditorConfig}
            />
        </div>
    );

    const expressionEditor = (
        <div className="exp-wrapper">
            <LowCodeExpressionEditor
                {...expressionEditorConfig}
            />
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
                <FormControl data-testid="property-form" className={classes.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Assignment"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formNameWrapper}>
                            {nameExpressionEditor}
                        </div>
                        <div className={classes.formEqualWrapper}>
                            {
                                <div className={classes.formEqualContainer}>
                                    <div className={classes.equalContainer}>
                                        <Typography variant='body2' className={classes.equalCode}>=</Typography>
                                    </div>
                                    <div className={classes.valueContainer}>
                                        {expressionEditor}
                                    </div>
                                </div>
                            }
                        </div>
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
                </FormControl >
            )}
        </>
    )
}
