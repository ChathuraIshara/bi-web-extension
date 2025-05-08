/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";

import { FormControl } from "@material-ui/core";
import { CustomExpressionConfig, ProcessConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";

import { Context } from "../../../../../../../Contexts/Diagram";
import { useStyles as useFormStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { isStatementEditorSupported } from "../../../../Utils";

interface LogConfigProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddCustomStatementConfig(props: LogConfigProps) {
    const formClasses = useFormStyles();
    const intl = useIntl();

    const {
        props: {
            ballerinaVersion,
            isMutationProgress: isMutationInProgress,
            currentFile,
            stSymbolInfo,
            fullST,
            importStatements,
            experimentalEnabled
        },
        api: {
            ls: { getExpressionEditorLangClient },
            code: {
                modifyDiagram,
                updateFileContent
            },
            library
        }
    } = useContext(Context);

    const { config, formArgs, onCancel, onSave, onWizardClose } = props;

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
        id: "lowcode.develop.configForms.customStatement.title",
        defaultMessage: "Other"
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
                        initialSource: defaultExpression ? defaultExpression : "STATEMENT",
                        formArgs: {
                            formArgs: {
                                targetPosition: {
                                    startLine: config.targetPosition.startLine,
                                    startColumn: config.targetPosition.startColumn
                                }
                            }
                        },
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
                        ballerinaVersion
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
