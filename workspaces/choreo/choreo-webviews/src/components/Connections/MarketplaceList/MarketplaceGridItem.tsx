/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { type MarketplaceItem, getTimeAgo } from "@wso2-enterprise/choreo-core";
import classNames from "classnames";
import React from "react";
import type { FC } from "react";
import { Badge, BadgeSkeleton } from "../../Badge";
import { SkeletonText } from "../../SkeletonText";

type Props = {
	onClick?: () => void;
	item?: MarketplaceItem;
	loading?: boolean;
};

export const MarketplaceGridItem: FC<Props> = ({ onClick, item, loading }) => {
	let visibility = "Project";
	if (item?.visibility.includes("PUBLIC")) {
		visibility = "Public";
	} else if (item?.visibility.includes("ORGANIZATION")) {
		visibility = "Organization";
	}
	return (
		<div
			onClick={item ? onClick : undefined}
			className={classNames({
				"flex min-h-32 flex-col gap-1 rounded-sm border-1 border-vsc-list-hoverBackground p-2": true,
				"cursor-pointer duration-200 hover:bg-vsc-list-hoverBackground": item,
				"animate-pulse": !item || loading,
			})}
		>
			<div className="flex flex-1 flex-col gap-1">
				{item ? <div className="line-clamp-2 font-semibold text-base">{item.name}</div> : <SkeletonText className="mb-0.5 w-1/2" />}
				<div className="flex flex-wrap gap-1">
					{item ? (
						<>
							<Badge>Type: {item.serviceType}</Badge>
							<Badge>Version: {item.version}</Badge>
							<Badge className="capitalize">Status: {item.status}</Badge>
						</>
					) : (
						<>
							<BadgeSkeleton />
							<BadgeSkeleton />
							<BadgeSkeleton />
						</>
					)}
				</div>
			</div>
			<div className="flex items-center justify-between gap-2 justify-self-end font-thin text-[10px] opacity-70">
				{item ? (
					<>
						<div className="line-clamp-1">Visibility: {visibility}</div>
						<div className="line-clamp-1 font-extralight opacity-70">Created: {getTimeAgo(new Date(Number.parseInt(item.createdTime) * 1000))}</div>
					</>
				) : (
					<>
						<SkeletonText className="h-3 w-20" />
						<SkeletonText className="h-3 w-28" />
					</>
				)}
			</div>
		</div>
	);
};
