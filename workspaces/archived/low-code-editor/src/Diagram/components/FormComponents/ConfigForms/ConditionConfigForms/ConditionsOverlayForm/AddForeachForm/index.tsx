/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {
    ConditionConfig,
    ForeachConfig,
    FormField,
    getAllVariables
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { BinaryExpression, ForeachStatement } from "@wso2-enterprise/syntax-tree";
import classnames from "classnames";

import Tooltip from '../../../../../../../components/TooltipV2'
import { Context } from "../../../../../../../Contexts/Diagram";
import { createForeachStatement, createForeachStatementWithBlock, getInitialSource } from "../../../../../../utils";
import { genVariableName } from "../../../../../Portals/utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { FormTextInput } from "../../../../FormFieldComponents/TextField/FormTextInput";
import { FormElementProps } from "../../../../Types";
import { isStatementEditorSupported } from "../../../../Utils";
import { VariableTypeInput, VariableTypeInputProps } from "../../../Components/VariableTypeInput";

interface Iterations {
    start?: string;
    end?: string;
}

interface ForeachProps {
    condition: ConditionConfig | any;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export const DEFINE_RANGE: string = "Define Range";

export function AddForeachForm(props: ForeachProps) {
    const {
        props: {
            ballerinaVersion,
            isMutationProgress: isMutationInProgress,
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

    const { condition, formArgs, onCancel, onWizardClose, onSave } = props;

    const [conditionExpression] = useState(condition.conditionExpression);
    let initCollectionDefined: boolean = (condition.scopeSymbols.length > 0);
    const initIterations: Iterations = {
        start: undefined,
        end: undefined
    };

    if (conditionExpression.model) {
        const forEachModel: ForeachStatement = (conditionExpression as ForeachConfig).model as ForeachStatement;
        switch (forEachModel.actionOrExpressionNode.kind) {
            case 'BinaryExpression':
                const expression = forEachModel.actionOrExpressionNode as BinaryExpression;
                if (expression.operator.kind === 'EllipsisToken') {
                    initCollectionDefined = false;
                    initIterations.start = expression.lhsExpr.source.trim();
                    initIterations.end = expression.rhsExpr.source.trim();
                }

                break;
            case 'SimpleNameReference':
                initCollectionDefined = true;
                break;
        }

    }

    const classes = useStyles();
    const intl = useIntl();
    const nameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$|^\[[a-zA-Z0-9_]*, *[a-zA-Z0-9_]*\]$");
    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const validateNameValue = (value: string) => {
        if (value && value !== '') {
            return value.match(nameRegex) !== null;
        }
        return true;
    };

    const onVariableNameChange = (value: string) => {
        conditionExpression.variable = value.match(nameRegex) !== null ? value : '';
    };

    if (!conditionExpression.variable || (conditionExpression.variable === '')) {
        conditionExpression.variable = genVariableName("item", getAllVariables(stSymbolInfo));
    }

    const [expressionValue, setExpressionValue] = useState(conditionExpression.collection)
    const [isValidExpression, setIsValidExpression] = useState(!!conditionExpression.collection);

    const [selectedType, setSelectedType] = useState(conditionExpression.type ? conditionExpression.type : "var");

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        conditionExpression.type = type;
    };

    const handleExpEditorChange = (value: string) => {
        conditionExpression.collection = value;
        setExpressionValue(value);
    }

    const handleSave = () => {
        condition.conditionExpression = conditionExpression;
        conditionExpression.type = selectedType;
        onSave();
    }

    const validateField = (fieldName: string, isInvalidFromField: boolean) => {
        setIsValidExpression(!isInvalidFromField)
    }

    const formField: FormField = {
        name: "iterable expression",
        displayName: "Iterable Expression",
        typeName: selectedType + "[]",
        value: expressionValue,
    };

    const forEachTooltipMessages = {
        expressionEditor: {
            title: intl.formatMessage({
                id: "lowcode.develop.configForms.forEach.expressionEditor.tooltip.title",
                defaultMessage: "Press CTRL+Spacebar for suggestions."
            }),
            actionText: intl.formatMessage({
                id: "lowcode.develop.configForms.forEach.expressionEditor.tooltip.actionText",
                defaultMessage: "Learn about Ballerina expressions here"
            }),
            actionLink: intl.formatMessage({
                id: "lowcode.develop.configForms.forEach.expressionEditor.tooltip.actionTitle",
                defaultMessage: "{learnBallerina}"
            }, { learnBallerina: "https://ballerina.io/learn/by-example/foreach-statement.html?is_ref_by_example=true" })
        },
        currentValueVariable: {
            title: intl.formatMessage({
                id: "lowcode.develop.configForms.forEach.currentValueVariable.tooltip.title",
                defaultMessage: "Current Value Variable"
            }),
        },
        codeBlockTooltip: intl.formatMessage({
            id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.codeBlock",
            defaultMessage: "To add code inside the foreach block, save foreach statement form and use the diagram add buttons",
        }),
    };
    const saveForEachButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.forEach.saveButton.label",
        defaultMessage: "Save"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.foreach.title",
        defaultMessage: "Foreach"
    });

    const invalidConnectionErrorMessage = intl.formatMessage({
        id: "lowcode.develop.configForms.forEach.invalidConnectionErrorMessage",
        defaultMessage: "Invalid collection name."
    });

    const cancelForEachButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.forEach.cancelButton.label",
        defaultMessage: "Cancel"
    });

    const expElementProps: FormElementProps<ExpressionEditorProps> = {
        model: formField,
        customProps: {
            validate: validateField,
            tooltipTitle: forEachTooltipMessages.expressionEditor.title,
            tooltipActionText: forEachTooltipMessages.expressionEditor.actionText,
            tooltipActionLink: forEachTooltipMessages.expressionEditor.actionLink,
            interactive: true,
            statementType: selectedType,
            changed: selectedType,
            customTemplate: {
                defaultCodeSnippet: `foreach ${selectedType} temp_var in  {}`,
                targetColumn: 22 + selectedType.length,
            },
            initialDiagnostics: formArgs?.model?.actionOrExpressionNode?.typeData?.diagnostics,
            editPosition: {
                startLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                endLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            }
        },
        onChange: handleExpEditorChange,
        defaultValue: conditionExpression.collection
    };

    const initialSource = formArgs.model ? getInitialSource(createForeachStatementWithBlock(
        conditionExpression.collection ? conditionExpression.collection : 'EXPRESSION',
        conditionExpression.variable,
        selectedType,
        (formArgs.model as ForeachStatement).blockStatement.statements.map(statement => {
            return statement.source
        })
    )) : getInitialSource(createForeachStatement(
        conditionExpression.collection ? conditionExpression.collection : 'EXPRESSION',
        conditionExpression.variable,
        selectedType
    ));

    const validateExpression = (fieldName: string, isInvalidType: boolean) => {
        setIsValidExpression(!isInvalidType)
    };

    const variableTypeConfig: VariableTypeInputProps = {
        displayName: 'Variable Type',
        value: selectedType,
        onValueChange: handleTypeChange,
        validateExpression,
        position: formArgs?.model ? {
            ...(formArgs?.model).position,
            endLine: 0,
            endColumn: 0,
        } : formArgs.targetPosition,
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
                <FormControl data-testid="foreach-form" className={classes.wizardFormControlExtended}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Foreach"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formCodeBlockWrapper}>
                            <div className={classes.formCodeExpressionWrapper}>
                                <Typography variant='body2' className={classes.startTitleCode}>foreach</Typography>
                                <div className={classes.variableExpEditorWrapper}>
                                    {variableTypeInput}
                                </div>
                                <div className={classes.variableExpEditorWrapper}>
                                    <FormTextInput
                                        customProps={{
                                            validate: validateNameValue,
                                        }}
                                        onChange={onVariableNameChange}
                                        defaultValue={conditionExpression.variable}
                                        label="Current Value"
                                        placeholder="Current Value"
                                        errorMessage={invalidConnectionErrorMessage}
                                    />
                                </div>
                            </div>
                            <div className={classes.formCodeExpressionEndWrapper}>
                                <Typography variant='body2' className={classnames(classes.forEachEndCode)}>in</Typography>
                                <div className={classes.formCodeExpressionLargeField}>
                                    <div className={classes.stmtEditorWrapper}>
                                        <LowCodeExpressionEditor {...expElementProps} />
                                    </div>
                                </div>
                                <Typography variant='body2' className={classes.forEachEndCode}>{`{`}</Typography>
                            </div>
                        </div>
                        <div className={classes.formCodeBlockWrapper}>
                            <div className={classes.middleDottedwrapper}>
                                <Tooltip type='info' text={{content: forEachTooltipMessages.codeBlockTooltip}}>
                                    <Typography variant='body2' className={classes.middleCode}>{`...`}</Typography>
                                </Tooltip>
                            </div>
                            <Typography variant='body2' className={classes.endCode}>{`}`}</Typography>
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText={cancelForEachButtonLabel}
                        cancelBtn={true}
                        saveBtnText={saveForEachButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={isValidExpression && expressionValue.length > 0}
                        onSave={handleSave}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    );
}
