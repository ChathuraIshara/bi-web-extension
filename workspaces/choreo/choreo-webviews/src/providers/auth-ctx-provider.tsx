/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserInfo } from "@wso2-enterprise/choreo-core";
import { ErrorBanner, ProgressIndicator } from "@wso2-enterprise/ui-toolkit";
import React, { type FC, type ReactNode, useContext, useEffect } from "react";
import { ChoreoWebViewAPI } from "../utilities/vscode-webview-rpc";
import { SignInView } from "../views/SignInView";

interface IAuthContext {
	userInfo: UserInfo | null;
}

const defaultContext: IAuthContext = {
	userInfo: null,
};

const ChoreoAuthContext = React.createContext(defaultContext);

export const useAuthContext = () => {
	return useContext(ChoreoAuthContext);
};

interface Props {
	children: ReactNode;
	viewType?: string;
}

export const AuthContextProvider: FC<Props> = ({ children, viewType }) => {
	const queryClient = useQueryClient();

	const {
		data: authState,
		error: authStateError,
		isLoading,
	} = useQuery({
		queryKey: ["auth_state"],
		queryFn: () => ChoreoWebViewAPI.getInstance().getAuthState(),
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		ChoreoWebViewAPI.getInstance().onAuthStateChanged((authState) => {
			queryClient.setQueryData(["auth_state"], authState);
		});
	}, []);

	return (
		<ChoreoAuthContext.Provider value={{ userInfo: authState?.userInfo || null }}>
			{authStateError ? (
				<ErrorBanner errorMsg="Failed to authenticate user" />
			) : (
				<>
					{isLoading ? (
						<ProgressIndicator />
					) : (
						<>{authState?.userInfo ? children : <SignInView className={!viewType?.includes("ActivityView") && "py-6"} />}</>
					)}
				</>
			)}
		</ChoreoAuthContext.Provider>
	);
};
