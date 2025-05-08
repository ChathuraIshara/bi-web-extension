/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { STModification } from "@wso2-enterprise/ballerina-core";
import { BallerinaRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { Drawer, ThemeColors } from "@wso2-enterprise/ui-toolkit";
import { STNode } from "@wso2-enterprise/syntax-tree";
import styled from "@emotion/styled";
import { URI } from "vscode-uri";
import { FormField } from "@wso2-enterprise/ballerina-side-panel";
import { RecordEditor as BalRecordEditor } from '@wso2-enterprise/record-creator';

const DrawerContainer = styled.div`
    fontFamily: GilmerRegular;
`;

export interface RecordEditorProps {
    isRecordEditorOpen: boolean;
    fields?: FormField[];
    rpcClient: BallerinaRpcClient;
    width?: string;
    onClose: () => void;
    updateFields?: (fields: FormField[]) => void;
    typeId?: string;
}

export function RecordEditor(props: RecordEditorProps) {
    const {
        isRecordEditorOpen,
        fields,
        rpcClient,
        onClose,
        updateFields,
        width
    } = props;
    const [recordFullST, setRecordFullST] = useState<STNode>();
    const [recordPath, setRecordPath] = useState<string>();

    const handleCloseRecordEditor = () => {
        onClose();
    };

    const handleCancelRecordEditor = (recordName: string | undefined) => {
        if (fields) {
            const updatedFormValues = fields.map((formField: FormField) => {
                // Check if recordName is type of string
                if (formField.key === "type" && typeof recordName === 'string') {
                    return { ...formField, value: recordName ?? '' };
                }
                return formField;
            });
            updateFields(updatedFormValues);
        }
        onClose();
    };

    const applyRecordModifications = async (modifications: STModification[]) => {
        const langServerRPCClient = rpcClient.getLangClientRpcClient();
        const filePath = (await rpcClient.getVisualizerLocation()).metadata?.recordFilePath;
        let updatedModifications = modifications;
        if (modifications.length === 1) {
            // Change the start position of the modification to the beginning of the file
            updatedModifications = [{
                ...modifications[0],
                startLine: 0,
                startColumn: 0,
                endLine: 0,
                endColumn: 0
            }];
        }
        const { parseSuccess, source: newSource, syntaxTree } = await langServerRPCClient?.stModify({
            astModifications: updatedModifications,
            documentIdentifier: {
                uri: URI.file(filePath ?? '').toString()
            }
        });
        if (parseSuccess && newSource && filePath) {
            rpcClient.getVisualizerRpcClient().addToUndoStack(newSource);
            await langServerRPCClient.updateFileContent({
                content: newSource,
                filePath
            });
        }
        setRecordFullST(syntaxTree);
    };

    useEffect(() => {
        rpcClient.getVisualizerLocation().then((vl) => {
            setRecordPath(vl.metadata?.recordFilePath);
        });
    }, []);

    return (
        <Drawer
            isOpen={isRecordEditorOpen}
            id="record-editor-drawer"
            isSelected={true}
            sx={{
                backgroundColor: ThemeColors.SURFACE_DIM,
                boxShadow: "none",
                width: width ? width : "400px",
            }}
        >
            <DrawerContainer>
                <BalRecordEditor
                    onClose={handleCloseRecordEditor}
                    applyModifications={applyRecordModifications}
                    importStatements={[]}
                    langServerRpcClient={rpcClient.getLangClientRpcClient()}
                    // @ts-ignore
                    libraryBrowserRpcClient={null}
                    onCancelStatementEditor={() => { }}
                    onCancel={handleCancelRecordEditor}
                    recordCreatorRpcClient={rpcClient.getRecordCreatorRpcClient()}
                    targetPosition={{ startLine: 0, startColumn: 0 }}
                    currentFile={{
                        content: "",
                        path: recordPath ?? '',
                        size: 0
                    }}
                    isDataMapper={false}
                    showHeader={false}
                    fullST={recordFullST}
                />
            </DrawerContainer>
        </Drawer>
    );
}
