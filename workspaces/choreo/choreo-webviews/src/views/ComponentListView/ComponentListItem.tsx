/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
	CommandIds,
	type ContextStoreComponentState,
	type Organization,
	type Project,
	type ViewComponentDetailsReq,
	getComponentTypeText,
	getTypeForDisplayType,
} from "@wso2-enterprise/choreo-core";
import classNames from "classnames";
import React, { type FC } from "react";
import { ContextMenu } from "../../components/ContextMenu";
import { ChoreoWebViewAPI } from "../../utilities/vscode-webview-rpc";

interface Props {
	project?: Project;
	org?: Organization;
	item: ContextStoreComponentState;
	isListLoading?: boolean;
	opened?: boolean;
}

export const ComponentListItem: FC<Props> = ({ item, isListLoading, opened, org, project }) => {
	const viewComponentDetails = () =>
		ChoreoWebViewAPI.getInstance().triggerCmd(CommandIds.ViewComponent, {
			component: item.component,
			project: project,
			organization: org,
			componentPath: item.componentFsPath,
		} as ViewComponentDetailsReq);

	return (
		<div
			className={classNames({
				"flex duration-200": true,
				"cursor-pointer hover:bg-vsc-list-hoverBackground": !opened,
				"animate-pulse cursor-progress": isListLoading,
				"cursor-pointer bg-vsc-list-dropBackground": opened,
			})}
			onClick={viewComponentDetails}
		>
			<div className="flex flex-1 flex-col break-all py-3 pl-5">
				<h4 className="font-thin text-[10px] tracking-wider opacity-90">{getComponentTypeText(getTypeForDisplayType(item.component?.spec?.type))}</h4>
				<h3 className="mb-0.5 line-clamp-1 font-bold text-sm">{item?.component?.metadata?.displayName}</h3>
				<p className="text-[11px] tracking-tight">
					Path: {item.workspaceName}/{item.componentRelativePath}
				</p>
			</div>
			<div className="pt-1 pr-3">
				<ContextMenu
					webviewSection="componentListItem"
					params={{
						component: item.component,
						project: project,
						organization: org,
						componentPath: item.componentFsPath,
					}}
				/>
			</div>
		</div>
	);
};
