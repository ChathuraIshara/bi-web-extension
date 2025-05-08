/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { STModification } from "@wso2-enterprise/ballerina-core";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

export interface StatementEditorComponentProps {
    label: string;
    initialSource: string;
    currentFile?: {
        content: string,
        path: string,
        size: number
    };
    applyModifications: (modifications: STModification[]) => void;
    onCancel: () => void;
    onClose: () => void;
    syntaxTree: STNode;
    targetPosition: NodePosition;
    config: any;
    skipSemicolon?: boolean;
    extraModules?: Set<string>;
    formArgs?: any;
}
function StatementEditorC(props: StatementEditorComponentProps) {
    const { rpcClient } = useRpcContext();
    const langServerRpcClient = rpcClient.getLangClientRpcClient();
    const libraryBrowserRPCClient = rpcClient.getLibraryBrowserRPCClient();

    const {
        label,
        initialSource,
        syntaxTree,
        currentFile,
        applyModifications,
        onCancel,
        onClose,
        targetPosition,
        config,
        skipSemicolon,
        extraModules,
        formArgs
    } = props;


    const openExternalUrl = (url: string) => {
        rpcClient.getCommonRpcClient().openExternalUrl({ url: url});
    }

    const stmtEditorComponent = StatementEditorWrapper(
        {
            formArgs: {
                formArgs: {
                    targetPosition: targetPosition,
                    ...formArgs 
                }
            },
            config: config,
            onWizardClose: onClose,
            syntaxTree: syntaxTree,
            stSymbolInfo: null,
            langServerRpcClient: langServerRpcClient,
            libraryBrowserRpcClient: libraryBrowserRPCClient,
            label: label,
            initialSource: initialSource,
            applyModifications,
            currentFile: {
                ...currentFile,
                content: currentFile.content,
                originalContent: currentFile.content
            },
            onCancel,
            skipSemicolon: skipSemicolon ? skipSemicolon : false,
            extraModules: extraModules,
            openExternalUrl: openExternalUrl
        }
    );

    return stmtEditorComponent;
}

export const StatementEditorComponent = React.memo(StatementEditorC);
