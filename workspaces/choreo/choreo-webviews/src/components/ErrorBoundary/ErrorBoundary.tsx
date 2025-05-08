/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Component, type ErrorInfo, type FC } from "react";
import { ChoreoWebViewAPI } from "../../utilities/vscode-webview-rpc";
import { Banner } from "../Banner";

interface ErrorBoundaryCProps {
	children: React.ReactNode;
	queryClient: QueryClient;
}

interface ErrorBoundaryState {
	hasError: boolean;
	clearedCache: boolean;
}

class ErrorBoundaryC extends Component<ErrorBoundaryCProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryCProps) {
		super(props);
		this.state = {
			hasError: false,
			clearedCache: false,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (this.state.clearedCache === false) {
			// If an exception is thrown, clear the queryClient cache and try again
			this.props.queryClient.clear();
			this.setState({ clearedCache: true });
		} else {
			// Show the error boundary if an exception is thrown even after clearing the cache
			this.setState({ hasError: true });
			ChoreoWebViewAPI.getInstance().sendTelemetryException({ error });
			console.error(error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return <Banner type="error" className="m-6" title="Oops! Something went wrong. Please reopen this window and try again" />;
		}

		return <div key={`Error-boundary-${this.state.clearedCache ? "with" : "with-reset"}-cache`}>{this.props.children}</div>;
	}
}

export const ErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
	const queryClient = useQueryClient();
	return <ErrorBoundaryC queryClient={queryClient}>{children}</ErrorBoundaryC>;
};
