/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FunctionDefinition } from "@wso2-enterprise/syntax-tree";
import { HistoryEntry, STModification } from "@wso2-enterprise/ballerina-core";
import { DataMapper } from "./components/DataMapper/DataMapper";
import { LangClientRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { LibraryBrowserRpcClient } from "@wso2-enterprise/ballerina-rpc-client/lib/rpc-clients/library-browser/rpc-client";
import { StatementEditorComponentProps } from "@wso2-enterprise/record-creator";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000,
            cacheTime: 1000,
        },
    },
});

export interface DataMapperViewProps {
    fnST: FunctionDefinition;
    filePath: string;
    langServerRpcClient: LangClientRpcClient;
    libraryBrowserRpcClient?: LibraryBrowserRpcClient;
    applyModifications: (modifications: STModification[], isRecordModification?: boolean) => Promise<void>;
    goToFunction?: (componentInfo: HistoryEntry) => Promise<void>;
    onClose?: () => void;
    renderRecordPanel?: (props: {
        closeAddNewRecord: (createdNewRecord?: string) => void,
        onUpdate: (update: boolean) => void
    } & StatementEditorComponentProps) => React.ReactElement;
}

export function DataMapperView(props: DataMapperViewProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <DataMapper {...props}/>
        </QueryClientProvider>
    );
}
