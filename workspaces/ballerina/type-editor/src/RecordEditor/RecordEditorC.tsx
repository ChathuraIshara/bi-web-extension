/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { createPropertyStatement } from "../utils";

import { CreateRecord } from "../CreateRecord";
import { UndoRedoManager } from "../components/UndoRedoManager";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { Context } from "../Context";
import { FormContainer } from "../style";
import { RecordEditorCProps } from ".";

const undoRedoManager = new UndoRedoManager();

export function RecordEditorC(props: RecordEditorCProps) {
    const { model, isDataMapper, onCancel, showHeader, onUpdate } = props;

    const {
        props: {
            targetPosition,
            langServerRpcClient,
            libraryBrowserRpcClient,
            currentFile,
            importStatements,
            currentReferences,
        },
        api: { applyModifications, onCancelStatementEditor, onClose },
    } = useContext(Context);

    const createModelSave = (recordString: string, pos: NodePosition) => {
        undoRedoManager.updateContent(currentFile.path, currentFile.content);
        undoRedoManager.addModification(currentFile.content);
        applyModifications([createPropertyStatement(recordString, targetPosition, false)]);
        if (isDataMapper) {
            onCancel(recordString);
        }
    };

    const stmtEditorComponent = StatementEditorWrapper({
        formArgs: {
            formArgs: {
                targetPosition: model ? targetPosition : { startLine: targetPosition.startLine, startColumn: targetPosition.startColumn },
            },
        },
        config: {
            type: "Custom",
            model: null,
        },
        onWizardClose: onClose,
        syntaxTree: null,
        stSymbolInfo: null,
        langServerRpcClient: langServerRpcClient,
        libraryBrowserRpcClient: libraryBrowserRpcClient,
        label: 'Record',
        initialSource: model?.source,
        applyModifications,
        currentFile: {
            ...currentFile,
            content: currentFile.content,
            originalContent: currentFile.content,
        },
        onCancel: onCancelStatementEditor,
        isExpressionMode: true,
        importStatements,
        currentReferences,
    });

    return (
        <>
            {model ? (
                // Edit existing record
                <FormContainer>{stmtEditorComponent}</FormContainer>
            ) : (
                // Create new record
                <CreateRecord
                    onCancel={onCancel}
                    onSave={createModelSave}
                    isDataMapper={isDataMapper}
                    undoRedoManager={undoRedoManager}
                    showHeader={showHeader}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}
