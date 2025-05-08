/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useQuery } from "@tanstack/react-query";
import { ComponentDisplayType, type ComponentKind, type ConnectionListItem, type Organization } from "@wso2-enterprise/choreo-core";
import classNames from "classnames";
import React, { type FC } from "react";
import { ChoreoWebViewAPI } from "../../../utilities/vscode-webview-rpc";
import { Banner } from "../../Banner";
import { Markdown } from "../../Markdown";
import { MarkdownSkeleton } from "../../Markdown/Markdown";

interface Props {
	item: ConnectionListItem;
	component: ComponentKind;
	org: Organization;
	isVisible: boolean;
}

export const ConnectionGuide: FC<Props> = ({ component, org, item, isVisible }) => {
	const {
		data: guideData,
		error: errorLoadingGuide,
		isLoading: isLoadingGuide,
	} = useQuery({
		queryKey: [
			"connection-guide",
			{ orgId: org.id, component: component?.metadata?.id, groupUuid: item?.groupUuid, serviceId: item?.serviceId, isVisible },
		],
		queryFn: () =>
			ChoreoWebViewAPI.getInstance()
				.getChoreoRpcClient()
				.getConnectionGuide({
					isProjectLvlConnection: false,
					buildpackType: component.spec.build.buildpack?.language,
					orgId: org.id?.toString(),
					orgUuid: org.uuid,
					serviceId: item?.serviceId,
					configGroupId: item?.groupUuid,
					isSpa: component?.spec?.type === ComponentDisplayType.ByocWebAppDockerLess,
					audience: "console",
					connectionSchemaId: item?.schemaReference,
					connectionName: item.name,
					configFileType: "component_v11",
				}),
		enabled: isVisible && !!item,
		keepPreviousData: true,
	});

	return (
		<div className={classNames(isLoadingGuide && "animate-pulse", "flex flex-col gap-2 overflow-y-auto px-4 sm:px-6")}>
			{guideData?.guide ? (
				<Markdown>{guideData?.guide}</Markdown>
			) : (
				<>
					{isLoadingGuide && <MarkdownSkeleton />}
					{errorLoadingGuide && <Banner type="error" title="Failed to load connection developer guide" />}
				</>
			)}
		</div>
	);
};
