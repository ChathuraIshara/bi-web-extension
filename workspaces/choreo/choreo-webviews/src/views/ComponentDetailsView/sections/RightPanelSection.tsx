/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { type FC, type PropsWithChildren, type ReactNode } from "react";

interface Props extends PropsWithChildren {
	title?: ReactNode;
}

export const RightPanelSection: FC<Props> = ({ title, children }) => {
	const [rightPanelRef] = useAutoAnimate();

	return (
		<div className="flex flex-col gap-3">
			{title && <div className="text-base">{title}</div>}
			<div className="flex flex-col gap-1" ref={rightPanelRef}>
				{children}
			</div>
		</div>
	);
};

export interface IRightPanelSectionItem {
	label: string;
	value: ReactNode;
	tooltip?: string;
}

export const RightPanelSectionItem: FC<IRightPanelSectionItem> = ({ label, value, tooltip }) => {
	return (
		<div
			className="line-clamp-1 flex w-full! items-center justify-between gap-0.5 break-all marker:flex-row"
			title={tooltip || ["string", "number"].includes(typeof value) ? `${label}: ${value}` : label}
		>
			<p className="line-clamp-1 break-all font-extralight opacity-80">{label}</p>
			<p className="line-clamp-1 break-all text-right">{value}</p>
		</div>
	);
};
