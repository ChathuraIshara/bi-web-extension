/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { RecordTypeDesc, STNode, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { StatementEditorComponentProps } from "../types";
import { RecordCreatorRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecordEditorWrapper } from "./RecordEditorWrapper";
import { IntlProvider } from "react-intl";
import messages from "../lang/en.json";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000
        },
    },
});

export interface RecordEditorCProps {
    model?: RecordTypeDesc | TypeDefinition;
    isDataMapper?: boolean;
    onCancel: (createdNewRecord?: string) => void;
    showHeader?: boolean;
    onUpdate?: (updated: boolean) => void;
}

export interface RecordEditorProps extends RecordEditorCProps, StatementEditorComponentProps {
    recordCreatorRpcClient: RecordCreatorRpcClient;
    fullST?: STNode;
}

export function RecordEditor(props: RecordEditorProps) {
    const {
        model,
        fullST,
        isDataMapper,
        onCancel,
        showHeader,
        targetPosition,
        langServerRpcClient,
        libraryBrowserRpcClient,
        recordCreatorRpcClient,
        currentFile,
        applyModifications,
        onCancelStatementEditor,
        onClose,
        importStatements,
        currentReferences,
        onUpdate
    } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <IntlProvider locale="en" defaultLocale="en" messages={messages}>
                <RecordEditorWrapper
                    model={model}
                    fullST={fullST}
                    isDataMapper={isDataMapper}
                    onCancel={onCancel}
                    showHeader={showHeader}
                    targetPosition={targetPosition}
                    langServerRpcClient={langServerRpcClient}
                    libraryBrowserRpcClient={libraryBrowserRpcClient}
                    recordCreatorRpcClient={recordCreatorRpcClient}
                    currentFile={currentFile}
                    applyModifications={applyModifications}
                    onCancelStatementEditor={onCancelStatementEditor}
                    onClose={onClose}
                    importStatements={importStatements}
                    currentReferences={currentReferences}
                    onUpdate={onUpdate}
                />
            </IntlProvider>
        </QueryClientProvider>
    );
}
