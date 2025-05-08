/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContextStoreState } from "@wso2-enterprise/choreo-core";
import React, { type FC, type ReactNode, useContext, useEffect } from "react";
import { ChoreoWebViewAPI } from "../utilities/vscode-webview-rpc";

const defaultContext: {
	state: ContextStoreState | undefined;
	isLoading: boolean;
} = {
	state: { items: {}, components: [], loading: false },
	isLoading: false,
};

const LinkedDirStateContext = React.createContext(defaultContext);

export const useLinkedDirStateContext = () => {
	return useContext(LinkedDirStateContext);
};

interface Props {
	children: ReactNode;
}

export const LinkedDirStateContextProvider: FC<Props> = ({ children }) => {
	const queryClient = useQueryClient();

	const { data: linkedDirState, isLoading } = useQuery({
		queryKey: ["context_state"],
		queryFn: () => ChoreoWebViewAPI.getInstance().getContextState(),
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		ChoreoWebViewAPI.getInstance().refreshContextState();
		ChoreoWebViewAPI.getInstance().onContextStateChanged((contextState) => {
			queryClient.setQueryData(["context_state"], contextState);
		});
	}, []);

	return <LinkedDirStateContext.Provider value={{ state: linkedDirState, isLoading }}>{children}</LinkedDirStateContext.Provider>;
};
