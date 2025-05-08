/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { GitProvider, getShortenedHash, parseGitURL } from "@wso2-enterprise/choreo-core";
import classnames from "classnames";
import React, { type FC, type HTMLProps } from "react";
import { ChoreoWebViewAPI } from "../../utilities/vscode-webview-rpc";

interface Props {
	className?: HTMLProps<HTMLElement>["className"];
	commitHash: string;
	commitMessage: string;
	repoPath: string;
}

export const CommitLink: FC<Props> = ({ className, commitHash, commitMessage, repoPath }) => {
	const openLink = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation();

		const parsedRepo = parseGitURL(repoPath);
		const provider = parsedRepo ? parsedRepo[2] : null;
		let commitUrl = `${repoPath}/commit/${commitHash}`;
		if (provider === GitProvider.BITBUCKET) {
			commitUrl = `${repoPath}/src/${commitHash}`;
		} else if (provider === GitProvider.GITLAB_SERVER) {
			commitUrl = `${repoPath}/-/commit/${commitHash}`;
		}
		ChoreoWebViewAPI.getInstance().openExternal(commitUrl);
	};

	return (
		<VSCodeLink onClick={openLink} className={classnames("text-vsc-foreground", className)} title={`Open Commit (Commit Message: ${commitMessage})`}>
			{getShortenedHash(commitHash)}
		</VSCodeLink>
	);
};
