/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { CustomExpressionConfig, FormElementProps, ProcessConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { AssignmentStatement, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../Contexts/Diagram";
import { createPropertyStatement, getInitialSource } from "../../../../../../utils";
import { useStyles as useFormStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { isStatementEditorSupported } from "../../../../Utils";

interface AddFunctionCallConfigProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddFunctionCallConfig(props: AddFunctionCallConfigProps) {
    const formClasses = useFormStyles();
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

    let callExpression: string = '';

    const existingProperty = config && config.model;
    if (existingProperty && STKindChecker.isCallStatement(config.model)) {
        callExpression = config.model.expression?.source.trim();
    }

    const varExp = callExpression ? callExpression + ";" : 'FUNCTION_CALL() ;';
    const initialSource = `${varExp}`;

    const expressionFormConfig: CustomExpressionConfig = config.config as CustomExpressionConfig;
    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    let defaultExpression = "";
    if (config?.model) {
        defaultExpression = config?.model?.source.trim();
    }

    const [expression, setExpression] = useState(defaultExpression);
    const [isFormValid, setIsFormValid] = useState(!!expression);

    const onExpressionChange = (value: any) => {
        setExpression(value);
    };

    const onSaveBtnClick = () => {
        expressionFormConfig.expression = expression;
        onSave();
    }

    const validateExpression = (_field: string, isInvalid: boolean) => {
        const isValidExpression = !isInvalid ? (expression !== undefined && expression !== "") : false;
        setIsFormValid(isValidExpression);
    }

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.functionCall.title",
        defaultMessage: "Function Call"
    });

    const saveCustomStatementButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.customStatement.saveButton.label",
        defaultMessage: "Save"
    });

    const customStatementTooltipMessages = {
        title: intl.formatMessage({
            id: "lowcode.develop.configForms.customStatement.expressionEditor.tooltip.title",
            defaultMessage: "Press CTRL+Spacebar for suggestions."
        }),
        actionText: intl.formatMessage({
            id: "lowcode.develop.configForms.customStatement.expressionEditor.tooltip.actionText",
            defaultMessage: "Learn about Ballerina expressions here"
        }),
        actionLink: intl.formatMessage({
            id: "lowcode.develop.configForms.customStatement.expressionEditor.tooltip.actionTitle",
            defaultMessage: "{learnBallerina}"
        }, { learnBallerina: "https://ballerina.io/learn/by-example/" })
    }

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
                <FormControl data-testid="custom-expression-form" className={formClasses.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Other"}
                    />
                    <div className={formClasses.formContentWrapper}>
                        <div className={formClasses.formNameWrapper}>
                            <LowCodeExpressionEditor
                                model={{ name: "statement", value: expression }}
                                customProps={{
                                    validate: validateExpression,
                                    tooltipTitle: customStatementTooltipMessages.title,
                                    tooltipActionText: customStatementTooltipMessages.actionText,
                                    tooltipActionLink: customStatementTooltipMessages.actionLink,
                                    interactive: true,
                                    customTemplate: {
                                        defaultCodeSnippet: ' ',
                                        targetColumn: 1,
                                    },
                                    editPosition: config?.model?.position || formArgs?.targetPosition,
                                    initialDiagnostics: config?.model?.typeData?.diagnostics,
                                    disableFiltering: true,
                                    diagnosticsFilterExtraColumns: { end: 1 },
                                    diagnosticsFilterExtraRows: { end: 1 }
                                }}
                                onChange={onExpressionChange}
                            />
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText={saveCustomStatementButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={isFormValid}
                        onSave={onSaveBtnClick}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    )
}
