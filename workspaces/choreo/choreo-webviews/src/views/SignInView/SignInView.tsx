/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useMutation } from "@tanstack/react-query";
import { CommandIds } from "@wso2-enterprise/choreo-core";
import classNames from "classnames";
import React, { type FC, type HTMLProps } from "react";
import { Button } from "../../components/Button";
import { ChoreoWebViewAPI } from "../../utilities/vscode-webview-rpc";

interface Props {
	className?: HTMLProps<HTMLElement>["className"];
}

export const SignInView: FC<Props> = ({ className }) => {
	const { mutate: signInCmd, isLoading: isInitSignIn } = useMutation({
		mutationFn: async () => ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.SignIn),
	});
	return (
		<div className={classNames("flex w-full flex-col gap-[10px] px-6 py-2", className)}>
			<p>Sign in to Choreo to get started.</p>
			<Button className="w-full max-w-80 self-center sm:self-start" onClick={() => signInCmd()} disabled={isInitSignIn}>
				Sign In
			</Button>
		</div>
	);
};
