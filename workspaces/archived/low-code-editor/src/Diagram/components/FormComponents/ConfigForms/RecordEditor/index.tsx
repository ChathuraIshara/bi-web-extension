/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from 'react';

import { FormControl } from "@material-ui/core";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { NodePosition, RecordTypeDesc, STNode, TypeDefinition } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import { createPropertyStatement } from "../../../../utils";
import { UndoRedoManager } from "../../UndoRedoManager";
import { wizardStyles } from "../style";

import { CreateRecord } from "./CreateRecord";
import { RecordModel } from "./types";

export interface RecordEditorProps {
    name: string;
    model?: RecordTypeDesc | TypeDefinition;
    targetPosition?: NodePosition;
    formType: string;
    isTypeDefinition?: boolean;
    isDataMapper?: boolean;
    onCancel: (createdNewRecord?: string) => void;
    onSave: (typeDesc: string, recModel: RecordModel) => void;
    showHeader?: boolean;
    filePath?: string;
    currentST?: STNode;
}

const undoRedoManager = new UndoRedoManager();

export function RecordEditor(props: RecordEditorProps) {
    const { onCancel, model, targetPosition, formType, isDataMapper, showHeader, filePath, currentST } = props;

    const overlayClasses = wizardStyles();

    const {
        props: {
            stSymbolInfo,
            currentFile,
            fullST,
            importStatements,
            experimentalEnabled
        },
        api: {
            ls: { getExpressionEditorLangClient },
            code: {
                modifyDiagram,
                updateFileContent
            },
            library
        }
    } = useContext(Context);

    const getUpdatedCurrentFile = () => {
        return {
            content: currentST.source,
            path: filePath,
            size: 1
        };
    }

    const getStatementEditor = () => {
        return StatementEditorWrapper(
            {
                label: 'Record',
                initialSource: model?.source,
                formArgs: {
                    formArgs: {
                        targetPosition: model ? targetPosition : { startLine: targetPosition.startLine, startColumn: targetPosition.startColumn }
                    }},
                config: { type: formType, model},
                onWizardClose: onCancel,
                onCancel,
                currentFile: !filePath ? currentFile : getUpdatedCurrentFile(),
                getLangClient: getExpressionEditorLangClient,
                applyModifications: modifyDiagram,
                updateFileContent,
                library,
                syntaxTree: !filePath ? fullST : currentST,
                stSymbolInfo,
                importStatements,
                experimentalEnabled,
                isModuleVar: true
            }
        );
    }

    const createModelSave = (recordString: string, pos: NodePosition) => {
        undoRedoManager.updateContent(currentFile.path, currentFile.content);
        undoRedoManager.addModification(currentFile.content);
        modifyDiagram([
            createPropertyStatement(recordString, targetPosition, false)
        ]);
        if (isDataMapper) {
            onCancel(recordString);
        }
    }

    return (
        <>
            {model ? (
                // Edit existing record
                <FormControl data-testid="record-form" className={overlayClasses.wizardFormControlExtended}>
                    {getStatementEditor()}
                </FormControl>
            ) : (
                // Create new record
                <CreateRecord
                    onCancel={onCancel}
                    onSave={createModelSave}
                    targetPosition={targetPosition}
                    isDataMapper={isDataMapper}
                    undoRedoManager={undoRedoManager}
                    showHeader={showHeader}
                />
            )}
        </>
    );
}
