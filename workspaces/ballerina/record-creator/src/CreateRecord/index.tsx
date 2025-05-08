/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";

import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { RecordConfigTypeSelector } from "../RecordConfigTypeSelector";
import { RecordFromJson } from "../RecordFromJson";
import { RecordFromXml } from "../RecordFromXml";
import { Context } from "../Context";
import { UndoRedoManager } from "../components/UndoRedoManager";
import { isSupportedSLVersion } from "../components/FormComponents/Utils";
import { FormContainer } from "../style";

enum ConfigState {
    STATE_SELECTOR,
    EDIT_CREATED,
    IMPORT_FROM_JSON,
    IMPORT_FROM_XML,
}

export interface CreateRecordProps {
    isDataMapper?: boolean;
    undoRedoManager?: UndoRedoManager;
    onCancel: (createdNewRecord?: string) => void;
    onSave: (recordString: string, modifiedPosition: NodePosition) => void;
    showHeader?: boolean;
    onUpdate?: (updated: boolean) => void;
}

export function CreateRecord(props: CreateRecordProps) {
    const { isDataMapper, undoRedoManager, showHeader, onSave, onCancel, onUpdate } = props;
    const {
        props: { targetPosition, ballerinaVersion },
    } = useContext(Context);

    const [editorState, setEditorState] = useState<ConfigState>(ConfigState.STATE_SELECTOR);

    const handleImportJSONClick = () => {
        setEditorState(ConfigState.IMPORT_FROM_JSON);
    };

    const handleImportXMLClick = () => {
        setEditorState(ConfigState.IMPORT_FROM_XML);
    };

    const handleImportJsonSave = (value: string, pos: NodePosition) => {
        onSave(value, pos);
    };

    const handleImportXmlSave = (value: string, pos: NodePosition) => {
        onSave(value, pos);
    };

    const checkBallerinVersion = () => {
        if (ballerinaVersion) {
            return isSupportedSLVersion(ballerinaVersion, 220172);
        }
        return false;
    };

    return (
        <FormContainer data-testid="record-form">
            <>
                {editorState === ConfigState.STATE_SELECTOR && (
                    <RecordConfigTypeSelector
                        onImportFromJson={handleImportJSONClick}
                        onImportFromXml={checkBallerinVersion() ? handleImportXMLClick : null}
                        onCancel={onCancel}
                        isDataMapper={isDataMapper}
                    />
                )}
                {editorState === ConfigState.IMPORT_FROM_JSON && (
                    <RecordFromJson
                        undoRedoManager={undoRedoManager}
                        onCancel={onCancel}
                        onSave={handleImportJsonSave}
                        isHeaderHidden={showHeader ? false : isDataMapper}
                        onUpdate={onUpdate}
                    />
                )}
                {editorState === ConfigState.IMPORT_FROM_XML && (
                    <RecordFromXml
                        undoRedoManager={undoRedoManager}
                        onCancel={onCancel}
                        onSave={handleImportXmlSave}
                        isHeaderHidden={showHeader ? false : isDataMapper}
                        onUpdate={onUpdate}
                    />
                )}
            </>
        </FormContainer>
    );
}
