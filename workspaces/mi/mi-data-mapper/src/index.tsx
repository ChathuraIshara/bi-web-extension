/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useMemo, useState } from "react";

/** @jsx jsx */
import { Global, css } from '@emotion/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DMType, IOTypeResponse } from "@wso2-enterprise/mi-core";
import { Project, SyntaxKind, FunctionDeclaration } from "ts-morph";

import { MIDataMapper } from "./components/DataMapper/DataMapper";
import { ErrorBoundary } from "@wso2-enterprise/ui-toolkit";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { hasFields } from "./components/Diagram/utils/node-utils";

export { resetStoresForNewLoad } from "./store/store";

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

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

export interface DataMapperViewProps {
    filePath: string;
    fileContent: string;
    functionName: string;
    dmIOTypes: IOTypeResponse;
    configName: string;
    updateFileContent: (fileContent: string) => Promise<void>;
}

// Function to check if input and output trees are non-empty and if the return statement is not empty (i.e. mappings exist)
export function doesMappingExist(
    fnST: FunctionDeclaration | undefined,
    inputTrees: DMType[],
    outputTree: DMType
  ): boolean {
    const hasNonEmptyIOTrees = inputTrees.every((tree) => hasFields(tree)) && hasFields(outputTree);
    if (!hasNonEmptyIOTrees) {
      // If input or output trees are empty, we cannot have mappings
      return false;
    }
    // Check if the return statement is empty
    const returnStatement = fnST?.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0];
    const isEmptyReturnStatement =
      // If return type is an object
      returnStatement?.getExpressionIfKind(SyntaxKind.ObjectLiteralExpression)?.getProperties().length === 0 ||
      // If return type is an array
      returnStatement?.getExpressionIfKind(SyntaxKind.ArrayLiteralExpression)?.getElements().length === 0;
    // Mappings exist if the return statement is not empty
    return !isEmptyReturnStatement;
  }
  

export function DataMapperView(props: DataMapperViewProps) {
    const {
        filePath,
        fileContent,
        functionName,
        dmIOTypes,
        updateFileContent,
        configName
    } = props;

    const [isLoading, setIsLoading] = useState(false); 
    const [isMapping, setIsMapping] = useState(false);

    const { rpcClient } = useVisualizerContext();

    const functionST = useMemo(() => {

        const project = new Project({
            useInMemoryFileSystem: true,
            compilerOptions: { target: 2 }
        });
        const sourceFile = project.createSourceFile(filePath, fileContent);
        const fnST = sourceFile.getFunction(functionName);

        if (!doesMappingExist(fnST, dmIOTypes.inputTrees, dmIOTypes.outputTree)) {
            rpcClient.getMiVisualizerRpcClient().retrieveContext({
                key: "showDmLandingMessage",
                contextType: "workspace"
            }).then((response) => {
                if (response.value ?? true) {
                    rpcClient.getMiVisualizerRpcClient().showNotification({
                        message: "Begin mapping by selecting a field from the Input section and then selecting a corresponding field in the Output section.",
                        options: ["Don't show this again"],
                        type: "info",
                    }).then((response) => {
                        if (response.selection) {
                            rpcClient.getMiVisualizerRpcClient().updateContext({
                                key: "showDmLandingMessage",
                                value: false,
                                contextType: "workspace"
                            });
                        }
                    });
                }
            });
        }

        return fnST;

    }, [rpcClient, filePath, fileContent, functionName]);

    const applyModifications = async (fileContent: string) => {
        await updateFileContent(fileContent);
    };

    return (
        <ErrorBoundary errorMsg="An error occurred while rendering the MI Data Mapper">
            <QueryClientProvider client={queryClient}>
                <Global styles={globalStyles} />
                <MIDataMapper
                    fnST={functionST}
                    dmIOTypes={dmIOTypes}
                    fileContent={fileContent}
                    applyModifications={applyModifications}
                    filePath={filePath}
                    configName={configName}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isMapping={isMapping}
                    setIsMapping={setIsMapping}
                />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
