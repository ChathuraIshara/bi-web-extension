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

import { FormControl, Typography } from "@material-ui/core";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import { ConditionConfig, FormField, } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { WhileStatement } from "@wso2-enterprise/syntax-tree";

import Tooltip from '../../../../../../../components/TooltipV2';
import { Context } from "../../../../../../../Contexts/Diagram";
import { createWhileStatement, createWhileStatementWithBlock, getInitialSource } from "../../../../../../utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { FormElementProps } from "../../../../Types";
import { isStatementEditorSupported } from "../../../../Utils";

export interface WhileProps {
    condition: ConditionConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddWhileForm(props: WhileProps) {
    const {
        props: {
            isMutationProgress: isMutationInProgress,
            currentFile,
            fullST,
            stSymbolInfo,
            importStatements,
            ballerinaVersion,
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

    const { condition, formArgs, onCancel, onSave, onWizardClose } = props;
    const classes = useStyles();
    const intl = useIntl();

    const [isInvalid, setIsInvalid] = useState(true);
    const [conditionExpression, setConditionExpression] = useState(condition.conditionExpression);

    const handleExpEditorChange = (value: string) => {
        setConditionExpression(value);
    }

    const validateField = (fieldName: string, isInvalidFromField: boolean) => {
        setIsInvalid(isInvalidFromField)
    }

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);
    const formField: FormField = {
        name: "condition",
        displayName: "Condition",
        typeName: "boolean",
        value: conditionExpression,
    }

    const whileStatementTooltipMessages = {
        title: intl.formatMessage({
            id: "lowcode.develop.configForms.whileStatementTooltipMessages.expressionEditor.tooltip.title",
            defaultMessage: "Press CTRL+Spacebar for suggestions."
        }),
        actionText: intl.formatMessage({
            id: "lowcode.develop.configForms.whileStatementTooltipMessages.expressionEditor.tooltip.actionText",
            defaultMessage: "Learn about Ballerina expressions here"
        }),
        actionLink: intl.formatMessage({
            id: "lowcode.develop.configForms.whileStatementTooltipMessages.expressionEditor.tooltip.actionTitle",
            defaultMessage: "{learnBallerina}"
        }, { learnBallerina: "https://ballerina.io/learn/by-example/while-statement.html?is_ref_by_example=true" }),
        codeBlockTooltip: intl.formatMessage({
            id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.codeBlock",
            defaultMessage: "To add code inside the while block, save while statement form and use the diagram add buttons",
        }),
    };
    const expElementProps: FormElementProps<ExpressionEditorProps> = {
        model: formField,
        customProps: {
            validate: validateField,
            tooltipTitle: whileStatementTooltipMessages.title,
            tooltipActionText: whileStatementTooltipMessages.actionText,
            tooltipActionLink: whileStatementTooltipMessages.actionLink,
            interactive: true,
            statementType: formField.typeName,
            expressionInjectables: {
                list: formArgs?.expressionInjectables?.list,
                setInjectables: formArgs?.expressionInjectables?.setInjectables
            },
            initialDiagnostics: formArgs?.model?.condition?.typeData?.diagnostics,
            editPosition: {
                startLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                endLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            }
        },
        onChange: handleExpEditorChange,
        defaultValue: condition.conditionExpression
    };

    const handleOnSaveClick = () => {
        condition.conditionExpression = conditionExpression;
        onSave();
    }

    const saveWhileButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.while.saveButton.label",
        defaultMessage: "Save"
    });

    const cancelWhileButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.while.cancelButton.label",
        defaultMessage: "Cancel"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.while.title",
        defaultMessage: "If"
    });

    const initialSource = formArgs.model ? getInitialSource(createWhileStatementWithBlock(
        conditionExpression ? conditionExpression as string : 'EXPRESSION',
        (formArgs.model as WhileStatement).whileBody.statements.map(statement => {
            return statement.source
        })
    )) : getInitialSource(createWhileStatement(
        conditionExpression ? conditionExpression as string : 'EXPRESSION'
    ));

    return (
        <>
            {statementEditorSupported ? (
                StatementEditorWrapper(
                    {
                        label: formTitle,
                        initialSource,
                        formArgs: { formArgs },
                        config: condition,
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
                        openExternalUrl,
                        skipSemicolon: true
                    }
                )
            ) : (
                <FormControl data-testid="while-form" className={classes.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"While"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formCodeBlockWrapper}>
                            <div className={classes.formCodeExpressionEndWrapper}>
                                <Typography variant='body2' className={classes.ifStartCode}>while</Typography>
                                <div className={classes.formCodeExpressionField}>
                                    <LowCodeExpressionEditor {...expElementProps} />
                                </div>
                                <Typography variant='body2' className={classes.ifStartCode}>{`{`}</Typography>
                            </div>
                        </div>
                        <div className={classes.formCodeExpressionValueRegularField}>
                            <div className={classes.middleDottedwrapper}>
                                <Tooltip type='info' text={{ content: whileStatementTooltipMessages.codeBlockTooltip }}>
                                    <Typography variant='body2' className={classes.middleCode}>{`...`}</Typography>
                                </Tooltip>
                            </div>
                            <Typography variant='body2' className={classes.endCode}>{`}`}</Typography>
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtn={true}
                        cancelBtnText={cancelWhileButtonLabel}
                        saveBtnText={saveWhileButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={!isInvalid && (conditionExpression as string)?.length > 0}
                        onSave={handleOnSaveClick}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    )
}
