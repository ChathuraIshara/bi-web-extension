/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";

import { FormControl } from "@material-ui/core";
import { getAllVariables, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../Contexts/Diagram";
import { getInitialSource, mutateTypeDefinition } from "../../../../../utils";
import { genVariableName } from "../../../../Portals/utils";
import { UndoRedoManager } from "../../../UndoRedoManager";
import { isSupportedSLVersion } from "../../../Utils";
import { wizardStyles } from "../../style";
import { RecordConfigTypeSelector } from "../RecordConfigTypeSelector";
import { RecordFromJson } from "../RecordFromJson";
import { RecordFromXml } from "../RecordFromXml";

enum ConfigState {
    STATE_SELECTOR,
    EDIT_CREATED,
    CREATE_FROM_SCRATCH,
    IMPORT_FROM_JSON,
    IMPORT_FROM_XML
}

export interface CreateRecordProps {
    targetPosition?: NodePosition;
    isDataMapper?: boolean;
    undoRedoManager?: UndoRedoManager;
    onCancel: (createdNewRecord?: string) => void;
    onSave: (recordString: string, modifiedPosition: NodePosition) => void;
    showHeader?: boolean;
}

export function CreateRecord(props: CreateRecordProps) {
    const { targetPosition, isDataMapper, undoRedoManager, showHeader, onSave, onCancel } = props;

    const {
        props: {
            stSymbolInfo,
            currentFile,
            fullST,
            importStatements,
            experimentalEnabled,
            ballerinaVersion
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

    const [editorState, setEditorState] = useState<ConfigState>(ConfigState.STATE_SELECTOR);
    const overlayClasses = wizardStyles();

    const handleCreateNewClick = () => {
        setEditorState(ConfigState.CREATE_FROM_SCRATCH);
    };

    const handleImportJSONClick = () => {
        setEditorState(ConfigState.IMPORT_FROM_JSON);
    };

    const handleImportXMLClick = () => {
        setEditorState(ConfigState.IMPORT_FROM_XML);
    }

    const handleImportJsonSave = (value: string, pos: NodePosition) => {
        onSave(value, pos);
    };

    const handleImportXmlSave = (value: string, pos: NodePosition) => {
        onSave(value, pos);
    };

    const handleModifyDiagram = (mutations: STModification[], options?: any) => {
        modifyDiagram(mutations, options);
        if (isDataMapper) {
            onCancel(mutations[0].config.STATEMENT);
        }
    }

    const statementEditor = (
        StatementEditorWrapper(
            {
                label: 'Record',
                initialSource: getInitialSource(mutateTypeDefinition(genVariableName("Record",
                    getAllVariables(stSymbolInfo), true), "record {};", targetPosition, true)),
                formArgs: {
                    formArgs: {
                        targetPosition
                    }
                },
                config: { type: "RecordEditor" },
                onWizardClose: onCancel,
                onCancel,
                currentFile,
                getLangClient: getExpressionEditorLangClient,
                applyModifications: handleModifyDiagram,
                updateFileContent,
                library,
                syntaxTree: fullST,
                stSymbolInfo,
                importStatements,
                experimentalEnabled,
                isModuleVar: true,
                isHeaderHidden: isDataMapper
            }
        )
    )

    const checkBallerinVersion = () => {
        if (ballerinaVersion) {
            return isSupportedSLVersion(ballerinaVersion, 220172);
        }
        return false;
    }

    return (
        <FormControl data-testid="record-form" className={overlayClasses.wizardFormControlExtended}>
            <>
                {(editorState === ConfigState.STATE_SELECTOR) && (
                    <RecordConfigTypeSelector
                        onImportFromJson={handleImportJSONClick}
                        onImportFromXml={checkBallerinVersion() ? handleImportXMLClick : null}
                        onCreateNew={handleCreateNewClick}
                        onCancel={onCancel}
                        isDataMapper={isDataMapper}
                    />
                )}
                {(editorState === ConfigState.IMPORT_FROM_JSON) && (
                    <RecordFromJson
                        undoRedoManager={undoRedoManager}
                        targetPosition={targetPosition}
                        onCancel={onCancel}
                        onSave={handleImportJsonSave}
                        isHeaderHidden={showHeader ? false : isDataMapper}
                    />
                )}
                {(editorState === ConfigState.IMPORT_FROM_XML) && (
                    <RecordFromXml
                        undoRedoManager={undoRedoManager}
                        targetPosition={targetPosition}
                        onCancel={onCancel}
                        onSave={handleImportXmlSave}
                        isHeaderHidden={showHeader ? false : isDataMapper}
                    />
                )}
                {(editorState === ConfigState.CREATE_FROM_SCRATCH) && (
                    <>
                        {statementEditor}
                    </>
                )}
            </>
        </FormControl>
    )
}
