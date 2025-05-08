/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useContext, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { ProcessConfig, SendStatementConfig } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";

import { Context } from '../../../../../../../Contexts/Diagram';
import { createSendStatement, getInitialSource } from '../../../../../../utils';

interface AddSendStatementProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddSendStatement(props: AddSendStatementProps) {
    const { config, formArgs, onCancel, onSave, onWizardClose } = props;
    const intl = useIntl();
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
            insights: { onEvent },
            library,
            openExternalUrl
        }
    } = useContext(Context);
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
        defaultMessage: "Async Send Statement"
    });

    const sendStatementConfig: SendStatementConfig = config.config as SendStatementConfig;
    sendStatementConfig.expression = sendStatementConfig.expression === '' ? 'EXPRESSION' : sendStatementConfig.expression;
    sendStatementConfig.targetWorker = sendStatementConfig.targetWorker === '' ? 'EXPRESSION' : sendStatementConfig.targetWorker;

    const initialSource = getInitialSource(createSendStatement(sendStatementConfig));

    const stmtEditorComponent = StatementEditorWrapper(
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
    );

    return (
        stmtEditorComponent
    )
}
