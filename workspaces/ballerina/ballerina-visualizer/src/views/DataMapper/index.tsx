/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useMemo } from "react";

import { DataMapperView } from "@wso2-enterprise/data-mapper-view";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { STModification, HistoryEntry } from "@wso2-enterprise/ballerina-core";
import { FunctionDefinition } from "@wso2-enterprise/syntax-tree";
import { RecordEditor, StatementEditorComponentProps } from "@wso2-enterprise/record-creator";
import { View } from "@wso2-enterprise/ui-toolkit";
import { URI, Utils } from "vscode-uri";
import { TopNavigationBar } from "../../components/TopNavigationBar";
import { FunctionForm } from "../BI";

interface DataMapperProps {
    projectPath: string;
    filePath: string;
    model: FunctionDefinition;
    functionName: string;
    applyModifications: (modifications: STModification[], isRecordModification?: boolean) => Promise<void>;
}

export function DataMapper(props: DataMapperProps) {
    const { projectPath, filePath, model, functionName, applyModifications } = props;
    const { rpcClient } = useRpcContext();
    const langServerRpcClient = rpcClient.getLangClientRpcClient();
    const libraryBrowserRPCClient = rpcClient.getLibraryBrowserRPCClient();
    const recordCreatorRpcClient = rpcClient.getRecordCreatorRpcClient();

    const hasInputs = useMemo(
        () => model.functionSignature.parameters?.length > 0,
        [model.functionSignature.parameters]
    );

    const hasOutputs = useMemo(
        () => model.functionSignature?.returnTypeDesc && model.functionSignature.returnTypeDesc.type,
        [model.functionSignature]
    );


    const goToFunction = async (entry: HistoryEntry) => {
        rpcClient.getVisualizerRpcClient().addToHistory(entry);
    };

    const applyRecordModifications = async (modifications: STModification[]) => {
        await props.applyModifications(modifications, true);
    };

    const renderRecordPanel = (props: {
        closeAddNewRecord: (createdNewRecord?: string) => void,
        onUpdate: (updated: boolean) => void
    } & StatementEditorComponentProps) => {
        return (
            <RecordEditor
                isDataMapper={true}
                onCancel={props.closeAddNewRecord}
                recordCreatorRpcClient={recordCreatorRpcClient}
                {...props}
                applyModifications={applyRecordModifications}
            />
        );
    };

    return (
        <>
            {!hasInputs || !hasOutputs ? (
                <FunctionForm
                    projectPath={projectPath}
                    filePath={filePath}
                    functionName={functionName}
                    isDataMapper={true}
                />
            ) : (
                <View>
                    <TopNavigationBar />
                    <DataMapperView
                        fnST={model}
                        filePath={filePath}
                        langServerRpcClient={langServerRpcClient}
                        libraryBrowserRpcClient={libraryBrowserRPCClient}
                        applyModifications={applyModifications}
                        goToFunction={goToFunction}
                        renderRecordPanel={renderRecordPanel}
                    />
                </View>
            )}
        </>
    );
};
