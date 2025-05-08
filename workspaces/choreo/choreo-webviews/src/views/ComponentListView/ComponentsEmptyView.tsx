/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { CommandIds, type ContextItemEnriched } from "@wso2-enterprise/choreo-core";
import { ProgressIndicator } from "@wso2-enterprise/ui-toolkit";
import React, { type FC } from "react";
import { Button } from "../../components/Button";
import { ChoreoWebViewAPI } from "../../utilities/vscode-webview-rpc";

interface Props {
	loading?: boolean;
	items?: ContextItemEnriched[];
	selected?: ContextItemEnriched;
}

export const ComponentsEmptyView: FC<Props> = ({ items, loading, selected }) => {
	const manageContext = () => ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.ManageDirectoryContext);

	return (
		<>
			{loading && <ProgressIndicator />}
			<div className="flex w-full flex-col gap-[10px] px-6 py-2">
				<p>
					Choreo component directories associated with project <VSCodeLink onClick={manageContext}>{selected.project?.name}</VSCodeLink>, are not
					detected within the current workspace.
				</p>
				<p>Create a new component.</p>
				<Button
					className="w-full max-w-80 self-center sm:self-start"
					onClick={() => ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.CreateNewComponent)}
					title="Create a Choreo component linked to your local directory. Build and deploy it to the cloud effortlessly."
				>
					Create Component
				</Button>
				{items.length > 1 && (
					<>
						<p>Multiple projects detected within the current workspace</p>
						<Button
							className="w-full max-w-80 self-center sm:self-start"
							onClick={() =>
								ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.ManageDirectoryContext, {
									onlyShowSwitchProject: true,
								})
							}
							title="Switch to different project context to manage the components of that project."
						>
							Switch Project
						</Button>
					</>
				)}
			</div>
		</>
	);
};
