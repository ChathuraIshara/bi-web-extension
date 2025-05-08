/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { WebviewState } from "@wso2-enterprise/choreo-core";
import React, { type FC, type ReactNode, useContext, useEffect } from "react";
import { ChoreoWebViewAPI } from "../utilities/vscode-webview-rpc";

const defaultContext: WebviewState = { openedComponentKey: "", componentViews: {}, choreoEnv: "prod" };

const ExtWebviewContext = React.createContext(defaultContext);

export const useExtWebviewContext = () => {
	return useContext(ExtWebviewContext);
};

interface Props {
	children: ReactNode;
}

export const ExtWebviewContextProvider: FC<Props> = ({ children }) => {
	const queryClient = useQueryClient();

	const { data: webviewContext } = useQuery({
		queryKey: ["webview_context"],
		queryFn: () => ChoreoWebViewAPI.getInstance().getWebviewStoreState(),
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		ChoreoWebViewAPI.getInstance().onWebviewStateChanged((webviewState) => {
			queryClient.setQueryData(["webview_context"], webviewState);
		});
	}, []);

	return <ExtWebviewContext.Provider value={webviewContext}>{children}</ExtWebviewContext.Provider>;
};
