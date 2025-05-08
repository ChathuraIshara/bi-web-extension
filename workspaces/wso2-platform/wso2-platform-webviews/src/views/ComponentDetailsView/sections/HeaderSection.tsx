/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useMutation } from "@tanstack/react-query";
import {
	CommandIds,
	type ComponentsDetailsWebviewProps,
	type DeploymentTrack,
	type IDeleteComponentCmdParams,
	type IOpenInConsoleCmdParams,
	getComponentKindRepoSource,
	getComponentTypeText,
	getIntegrationComponentTypeText,
	getTypeForDisplayType,
} from "@wso2-enterprise/wso2-platform-core";
import React, { type FC } from "react";
import { Button } from "../../../components/Button";
import { Codicon } from "../../../components/Codicon";
import { HeaderSection as HeaderSectionView } from "../../../components/HeaderSection";
import { useExtWebviewContext } from "../../../providers/ext-vewview-ctx-provider";
import { ChoreoWebViewAPI } from "../../../utilities/vscode-webview-rpc";

export const HeaderSection: FC<
	ComponentsDetailsWebviewProps & {
		allDeploymentTracks: DeploymentTrack[];
		deploymentTrack: DeploymentTrack;
		onChangeDeploymentTrack: () => void;
	}
> = ({ allDeploymentTracks, onChangeDeploymentTrack, deploymentTrack, component, organization, project }) => {
	const { extensionName } = useExtWebviewContext();
	const openInConsole = () =>
		ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.OpenInConsole, {
			component,
			project,
			organization,
		} as IOpenInConsoleCmdParams);

	const openGitPage = () => ChoreoWebViewAPI.getInstance().openExternal(getComponentKindRepoSource(component.spec.source).repo);

	const { mutate: onDeleteComponent, isLoading: deletingComponent } = useMutation({
		mutationFn: () =>
			ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.DeleteComponent, {
				component,
				project,
				organization,
			} as IDeleteComponentCmdParams),
	});

	const headerLabels: { label: string; value: string; onClick?: () => void; onClickTitle?: string }[] = [];

	if (deploymentTrack) {
		if (allDeploymentTracks.length > 1) {
			headerLabels.push({
				label: "Deployment Track",
				value: deploymentTrack?.branch,
				onClick: () => onChangeDeploymentTrack(),
				onClickTitle: "Change Deployment Track",
			});
		} else {
			headerLabels.push({ label: "Deployment Track", value: deploymentTrack?.branch });
		}
	}

	headerLabels.push({ label: "Project", value: project.name }, { label: "Organization", value: organization.name });
	const componentTypeTxt = getTypeForDisplayType(component?.spec?.type);
	return (
		<HeaderSectionView
			title={component.metadata.displayName}
			secondaryTitle={
				extensionName === "Devant"
					? getIntegrationComponentTypeText(componentTypeTxt, component?.spec?.subType)
					: getComponentTypeText(componentTypeTxt)
			}
			tags={headerLabels}
			buttons={[
				{ label: "Open in Console", onClick: () => openInConsole() },
				{ label: "Open Git Repository", onClick: () => openGitPage() },
			]}
			secondaryIcon={
				<Button
					appearance="icon"
					onClick={() => onDeleteComponent()}
					disabled={deletingComponent}
					title={`Delete ${extensionName === "Devant" ? "Integration" : "Component"}`}
					className="text-vsc-descriptionForeground duration-200 hover:text-vsc-errorForeground"
				>
					<Codicon name="trash" />
				</Button>
			}
		/>
	);
};
