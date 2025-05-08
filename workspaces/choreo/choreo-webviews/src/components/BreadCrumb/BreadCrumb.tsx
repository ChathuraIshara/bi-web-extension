/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import classNames from "classnames";
import React, { type FC, type ReactNode } from "react";

export interface BreadCrumbItem {
	label: string;
	onClick?: () => void;
}
interface Props {
	items: BreadCrumbItem[];
}

export const BreadCrumb: FC<Props> = ({ items }) => {
	const nodes: ReactNode[] = [];
	for (const [index, item] of items.entries()) {
		if (item.onClick) {
			nodes.push(
				<VSCodeLink className="text-sm text-vsc-foreground opacity-70" onClick={item.onClick}>
					{item.label}
				</VSCodeLink>,
			);
		} else {
			nodes.push(<span className={classNames("text-sm", index + 1 < items.length && "opacity-70")}>{item.label}</span>);
		}

		if (index + 1 < items.length) {
			nodes.push(<span className="text-sm opacity-70">/</span>);
		}
	}
	return <div className="flex flex-wrap items-center gap-1">{nodes}</div>;
};
