/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useQuery } from "@tanstack/react-query";
import { BallerinaProjectComponents, SyntaxTreeResponse } from "@wso2-enterprise/ballerina-core";
import { LangClientRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { URI } from "vscode-uri";

export const useBallerinaVersion = (
    langServerRpcClient: LangClientRpcClient
): {
    ballerinaVersion: string;
    isFetching: boolean;
    isError: boolean;
    refetch: any;
} => {
    const fetchBallerinaVersion = async () => {
        try {
            const ballerinaVersion = await langServerRpcClient.getBallerinaVersion();
            return ballerinaVersion.version;
        } catch (networkError: any) {
            console.error("Error while fetching ballerina version", networkError);
        }
    };

    const {
        data: ballerinaVersion,
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["fetchBallerinaVersion"],
        queryFn: fetchBallerinaVersion,
        networkMode: 'always'
    });

    return { ballerinaVersion, isFetching, isError, refetch };
};

export const useFullST = (
    filePath: string,
    langServerRpcClient: LangClientRpcClient
): {
    fullST: SyntaxTreeResponse;
    isFetching: boolean;
    isError: boolean;
    refetch: any;
} => {
    const fetchFullST = async () => {
        try {
            const fullST = await langServerRpcClient.getST({
                documentIdentifier: { uri: URI.file(filePath).toString() },
            });
            return fullST;
        } catch (networkError: any) {
            console.error("Error while fetching full syntax tree", networkError);
        }
    };

    const {
        data: fullST,
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["fetchFullST", filePath],
        queryFn: fetchFullST,
        networkMode: 'always'
    });

    return { fullST, isFetching, isError, refetch };
};

export const useBallerinaProjectComponent = (
    filePath: string,
    langServerRpcClient: LangClientRpcClient
): {
    ballerinaProjectComponents: BallerinaProjectComponents;
    isFetching: boolean;
    isError: boolean;
    refetch: any;
} => {
    const fetchBallerinaProjectComponents = async () => {
        try {
            const ballerinaProjectComponents = await langServerRpcClient.getBallerinaProjectComponents({
                documentIdentifiers: [
                    { uri: URI.file(filePath).toString() }
                ],
            });
            return ballerinaProjectComponents;
        } catch (networkError: any) {
            console.error("Error while fetching ballerina project components", networkError);
        }
    };

    const {
        data: ballerinaProjectComponents,
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["fetchBallerinaProjectComponents", filePath],
        queryFn: fetchBallerinaProjectComponents,
        networkMode: 'always'
    });

    return { ballerinaProjectComponents, isFetching, isError, refetch };
};
