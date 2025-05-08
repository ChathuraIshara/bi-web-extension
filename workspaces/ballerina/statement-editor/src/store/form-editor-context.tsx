/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: no-empty jsx-no-multiline-js
import React from 'react';

import {
    STModification,
    STSymbolInfo
} from "@wso2-enterprise/ballerina-core";
import { LangClientRpcClient } from '@wso2-enterprise/ballerina-rpc-client';
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import { WorkspaceEdit } from "vscode-languageserver-protocol";

import { CurrentModel } from "../models/definitions";


export const FormEditorContext = React.createContext({
    model: null,
    type: "",
    isLastMember: false,
    isEdit: false,
    targetPosition: null,
    currentFile: {
        content: "",
        path: "",
        size: 0
    },
    syntaxTree: null,
    fullST: null,
    stSymbolInfo: null,
    onCancel: () => undefined,
    onSave: () => undefined,
    onChange: (code: string, partialST: STNode, moduleList?: Set<string>, currentModel?: CurrentModel,
               newValue?: string, completionKinds?: number[], offsetLineCount?: number,
               diagnosticOffSet?: NodePosition) => undefined,
    langServerRpcClient: null,
    applyModifications: (modifications: STModification[], filePath?: string) => undefined,
    changeInProgress: false,
    renameSymbol: (workspaceEdits: WorkspaceEdit) =>  undefined
});

export interface FormEditorProps {
    children?: React.ReactNode,
    model?: STNode;
    type?: string;
    targetPosition?: NodePosition;
    onCancel: () => void;
    onSave: () => void;
    isLastMember?: boolean;
    stSymbolInfo?: STSymbolInfo;
    syntaxTree?: STNode;
    fullST?: STNode;
    isEdit?: boolean;
    langServerRpcClient: LangClientRpcClient;
    onChange: (code: string, partialST: STNode, moduleList?: Set<string>, currentModel?: CurrentModel,
               newValue?: string, completionKinds?: number[], offsetLineCount?: number,
               diagnosticOffSet?: NodePosition) => void;
    currentFile: {
        content: string,
        path: string,
        size: number
    };
    applyModifications: (modifications: STModification[], filePath?: string) => void;
    changeInProgress: boolean;
    renameSymbol: (workspaceEdits: WorkspaceEdit) => Promise<boolean>;
}

export const FormEditorContextProvider = (props: FormEditorProps) => {
    const {
        children,
        model,
        type,
        isEdit,
        stSymbolInfo,
        isLastMember,
        syntaxTree,
        fullST,
        currentFile,
        targetPosition,
        applyModifications,
        onCancel,
        onSave,
        onChange,
        langServerRpcClient,
        changeInProgress,
        renameSymbol
    } = props;

    return (
        <FormEditorContext.Provider
            value={{
                model,
                type,
                isEdit,
                stSymbolInfo,
                isLastMember,
                syntaxTree,
                fullST,
                currentFile,
                targetPosition,
                applyModifications,
                onCancel,
                onSave,
                onChange,
                langServerRpcClient,
                changeInProgress,
                renameSymbol
            }}
        >
            {children}
        </FormEditorContext.Provider>
    );
}
