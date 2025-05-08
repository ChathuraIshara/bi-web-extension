/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useContext } from 'react';
import { useIntl } from 'react-intl';

import {
    getAllVariables,
    ProcessConfig,
    WaitStatementConfig
} from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";

import { Context } from '../../../../../../../Contexts/Diagram';
import { createWaitStatement, getInitialSource } from '../../../../../../utils';
import { genVariableName } from "../../../../../Portals/utils";

interface AddWaitStatementProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}


export function AddWaitStatement(props: AddWaitStatementProps) {
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

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.variable.title",
        defaultMessage: "Wait Statement"
    });

    const waitStatementConfig: WaitStatementConfig = config.config as WaitStatementConfig;
    waitStatementConfig.type = waitStatementConfig.type === '' ? 'var' : waitStatementConfig.type;
    waitStatementConfig.varName = waitStatementConfig.varName === '' ? genVariableName("variable", getAllVariables(stSymbolInfo)) : waitStatementConfig.varName;
    waitStatementConfig.expression = waitStatementConfig.expression === '' ? 'EXPRESSION' : waitStatementConfig.expression;

    const initialSource = getInitialSource(createWaitStatement(waitStatementConfig));
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
    );
}
