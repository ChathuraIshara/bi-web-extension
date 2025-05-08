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

import { FormControl } from "@material-ui/core";
import { EndConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { FunctionDefinition, ModulePart, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../Contexts/Diagram";
import { createReturnStatement, getInitialSource } from "../../../../../../utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { isStatementEditorSupported } from "../../../../Utils";

interface ReturnFormProps {
    config: EndConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddReturnForm(props: ReturnFormProps) {
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

    const { config, formArgs, onCancel, onSave, onWizardClose } = props;
    const classes = useStyles();
    const intl = useIntl();

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const [returnExpression, setReturnExpression] = useState(config.expression);
    const onReturnValueChange = (value: any) => {
        setReturnExpression(value);
    };

    const onReturnExpressionSave = () => {
        config.expression = returnExpression;
        onSave();
    }

    const isOptionalReturn = () => {
        const st = fullST as ModulePart;
        let noReturn = true;
        /*
         TODO: Revise this logic as this will not work for blocks like
         Services and Class as functions are wrapped inside them. So you need to
         again do a iteration to find the function level.
        */
        st?.members?.forEach((def: FunctionDefinition) => {
            if (def.position?.startLine < formArgs?.targetPosition.startLine
                && formArgs?.targetPosition.startLine <= def.position?.endLine
                && (STKindChecker.isFunctionDefinition(def) || STKindChecker.isResourceAccessorDefinition(def))) {
                if (def.functionSignature && def.functionSignature.returnTypeDesc) {
                    noReturn = false;
                }
            }
        });
        return noReturn;
    }
    const isOptional = isOptionalReturn();

    const [isValidValue, setIsValidValue] = useState(isOptional);
    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        setIsValidValue(!isInvalid && (isOptional || returnExpression !== ""));
    };

    const saveReturnButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.return.saveButton.label",
        defaultMessage: "Save"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.Return.title",
        defaultMessage: "Return"
    });

    const returnStatementTooltipMessages = {
        title: intl.formatMessage({
            id: "lowcode.develop.configForms.returnStatementTooltipMessages.expressionEditor.tooltip.title",
            defaultMessage: "Press CTRL+Spacebar for suggestions."
        }),
        // TODO:Uncomment when Ballerina docs are available for Return
        // actionText: intl.formatMessage({
        //     id: "lowcode.develop.configForms.returnStatementTooltipMessages.expressionEditor.tooltip.actionText",
        //     defaultMessage: "Learn about Ballerina expressions here"
        // }),
        // actionLink: intl.formatMessage({
        //     id: "lowcode.develop.configForms.returnStatementTooltipMessages.expressionEditor.tooltip.actionTitle",
        //     defaultMessage: "{learnBallerina}"
        // }, { learnBallerina: "https://ballerina.io/learn/by-example/" })
    };

    const initialSource = getInitialSource(createReturnStatement(
        returnExpression ? returnExpression as string : 'EXPRESSION'
    ));

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
                <FormControl data-testid="return-form" className={classes.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Return"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formNameWrapper}>
                            <LowCodeExpressionEditor
                                model={{ name: "return expression", value: config.expression, optional: isOptional }}
                                customProps={{
                                    validate: validateExpression,
                                    tooltipTitle: returnStatementTooltipMessages.title,
                                    // TODO:Uncomment when Ballerina docs are available for Return
                                    // tooltipActionText: returnStatementTooltipMessages.actionText,
                                    // tooltipActionLink: returnStatementTooltipMessages.actionLink,
                                    interactive: true,
                                    customTemplate: {
                                        defaultCodeSnippet: 'return ;',
                                        targetColumn: 8
                                    },
                                    editPosition: formArgs.targetPosition,
                                    initialDiagnostics: formArgs?.model?.expression?.typeData?.diagnostics
                                }}
                                onChange={onReturnValueChange}
                            />
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText={saveReturnButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={isValidValue}
                        onSave={onReturnExpressionSave}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    );
}
