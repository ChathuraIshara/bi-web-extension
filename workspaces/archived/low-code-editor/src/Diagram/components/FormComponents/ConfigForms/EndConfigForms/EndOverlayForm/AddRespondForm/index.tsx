/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { ReactNode, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormControl } from "@material-ui/core";
import { EndConfig, httpResponse, PrimitiveBalType, RespondConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { ActionStatement, RemoteMethodCallAction, STKindChecker } from "@wso2-enterprise/syntax-tree";
import cn from "classnames";

import { Context } from "../../../../../../../Contexts/Diagram";
import { createRespond, getInitialSource } from "../../../../../../utils";
import { useStyles as useFormStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { isStatementEditorSupported } from "../../../../Utils";

interface RespondFormProps {
    config: EndConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export const DEFINE_RESPOND_EXP: string = "Define Respond Expression";

export function AddRespondForm(props: RespondFormProps) {
    const formClasses = useFormStyles();
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

    const respondFormConfig: RespondConfig = config.expression as RespondConfig;

    const isFormValid = (respondExp: string): boolean => {
        return (respondFormConfig.caller !== '') && (respondExp !== '');
    };

    const [validForm, setValidForm] = useState(isFormValid(respondFormConfig.respondExpression));
    const [validStatusCode, setValidStatusCode] = useState(validForm);
    const [statusCodeState, setStatusCode] = useState(undefined);
    const [resExp, setResExp] = useState(undefined);
    const intl = useIntl();

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const onExpressionChange = (value: any) => {
        respondFormConfig.respondExpression = value;
        setResExp(value);
        setValidForm(false);
    };

    const onSaveWithTour = () => {
        respondFormConfig.responseCode = statusCodeState;
        respondFormConfig.respondExpression = resExp;
        onSave();
    }

    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        if (isFormValid(resExp)) {
            setValidForm(!isInvalid);
        } else {
            setValidForm(false);
        }
    };

    const statusCodeValidateExpression = (fieldName: string, isInvalid: boolean) => {
        const responseCodeNumber = Math.floor(statusCodeState);
        if (statusCodeState) {
            if ((responseCodeNumber < 99) || (responseCodeNumber > 600)) {
                setValidStatusCode(false);
            } else {
                setValidStatusCode(true);
            }
        } else {
            setValidStatusCode(true);
        }
    };

    const onStatusCodeChange = (value: string) => {
        respondFormConfig.responseCode = value;
        setStatusCode(value);
    }

    const handleStatementEditorChange = (partialModel: ActionStatement) => {
        if (STKindChecker.isRemoteMethodCallAction(partialModel?.expression)) {
            const remoteCallModel: RemoteMethodCallAction = partialModel?.expression;
            respondFormConfig.respondExpression = remoteCallModel?.arguments[0].source;
            setResExp(remoteCallModel?.arguments[0].source);
        }
        setValidForm(false);
    }

    const saveRespondButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.respond.saveButton.label",
        defaultMessage: "Save"
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.Respond.title",
        defaultMessage: "Respond"
    });

    const respondStatementTooltipMessages = {
        title: intl.formatMessage({
            id: "lowcode.develop.configForms.respondStatementTooltipMessages.expressionEditor.tooltip.title",
            defaultMessage: "Press CTRL+Spacebar for suggestions."
        }),
        // TODO:Uncomment when Ballerina docs are available for Respond
        // actionText: intl.formatMessage({
        //     id: "lowcode.develop.configForms.respondStatementTooltipMessages.expressionEditor.tooltip.actionText",
        //     defaultMessage: "Learn about Ballerina expressions here"
        // }),
        // actionLink: intl.formatMessage({
        //     id: "lowcode.develop.configForms.respondStatementTooltipMessages.expressionEditor.tooltip.actionTitle",
        //     defaultMessage: "{learnBallerina}"
        // }, { learnBallerina: "https://lib.ballerina.io/ballerina/http/1.1.0-beta.1/clients/Caller#respond" })
    };

    const statusCodeComp: ReactNode = (
        <div>
            <LowCodeExpressionEditor
                model={{
                    optional: true,
                    name: "Status Code",
                    value: respondFormConfig.responseCode,
                    type: PrimitiveBalType.Int,
                }}
                customProps={{
                    validate: statusCodeValidateExpression,
                    statementType: PrimitiveBalType.Int,
                    customTemplate: {
                        defaultCodeSnippet: 'http:Response temp14U3resp = new; temp14U3resp.statusCode = ;',
                        targetColumn: 61
                    },
                    editPosition: formArgs.targetPosition,
                }}
                onChange={onStatusCodeChange}
            />
            {!validStatusCode ? <p className={formClasses.invalidCode}> <FormattedMessage id="lowcode.develop.configForms.Respond.invalidCodeError" defaultMessage="Invalid status code" /></p> : null}
        </div>
    );

    const initialSource = getInitialSource(createRespond(
        respondFormConfig.genType,
        respondFormConfig.variable,
        respondFormConfig.caller,
        resExp ? resExp : "EXPRESSION"
    ));

    const fieilTypes = [
        { type: PrimitiveBalType.String },
        { type: PrimitiveBalType.Xml },
        { type: PrimitiveBalType.Json },
        {
            type: PrimitiveBalType.Record,
            typeInfo: httpResponse
        }
    ];

    const statementType = [PrimitiveBalType.String, PrimitiveBalType.Xml, PrimitiveBalType.Json, httpResponse];

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
                <FormControl data-testid="respond-form" className={cn(formClasses.wizardFormControl)}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"Respond"}
                    />
                    <div className={formClasses.formContentWrapper}>
                        <div className={formClasses.formNameWrapper}>
                            <LowCodeExpressionEditor
                                model={{
                                    name: "respond expression",
                                    value: respondFormConfig.respondExpression,
                                    type: PrimitiveBalType.Union,
                                    fields: fieilTypes
                                }}
                                customProps={{
                                    validate: validateExpression,
                                    tooltipTitle: respondStatementTooltipMessages.title,
                                    // TODO:Uncomment when Ballerina docs are available for Respond
                                    // tooltipActionText: respondStatementTooltipMessages.actionText,
                                    // tooltipActionLink: respondStatementTooltipMessages.actionLink,
                                    interactive: true,
                                    statementType,
                                    customTemplate: {
                                        defaultCodeSnippet: 'checkpanic caller->respond( );',
                                        targetColumn: 28
                                    },
                                    editPosition: formArgs.targetPosition,
                                }}
                                onChange={onExpressionChange}
                            />
                        </div>
                        <div className={formClasses.formEqualWrapper}>
                            {(!config.model) ? statusCodeComp : null}
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText="Cancel"
                        cancelBtn={true}
                        saveBtnText={saveRespondButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={validForm}
                        onSave={onSaveWithTour}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    );
}
