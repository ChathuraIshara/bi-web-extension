/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider, type PersistedClient, type Persister } from "@tanstack/react-query-persist-client";
import React from "react";
import { ChoreoWebViewAPI } from "../utilities/vscode-webview-rpc";

/** Persist data within vscode workspace cache  */
const webviewStatePersister = (queryBaseKey: string) => {
	return {
		persistClient: async (client: PersistedClient) => {
			ChoreoWebViewAPI.getInstance().setWebviewCache(queryBaseKey, client);
		},
		restoreClient: async () => {
			const cache = await ChoreoWebViewAPI.getInstance().restoreWebviewCache(queryBaseKey);
			return cache;
		},
		removeClient: async () => {
			await ChoreoWebViewAPI.getInstance().clearWebviewCache(queryBaseKey);
		},
	} as Persister;
};

export const ChoreoWebviewQueryClientProvider = ({ type, children }: { type: string; children: React.ReactNode }) => {
	return (
		<PersistQueryClientProvider
			client={
				new QueryClient({
					defaultOptions: {
						queries: {
							cacheTime: 1000 * 60 * 60 * 24 * 7 * 31, // 1 month
							retry: false,
							refetchOnWindowFocus: false,
						},
					},
				})
			}
			persistOptions={{
				persister: webviewStatePersister(`react-query-persister-${type}`),
				buster: "choreo-webview-cache-v2",
			}}
		>
			{children}
		</PersistQueryClientProvider>
	);
};
