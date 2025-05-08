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
import React, { type HTMLProps } from "react";
import type { ReactNode } from "react";
import type { FC } from "react";
import { Button } from "../Button";
import { Codicon } from "../Codicon";

interface Props {
	className?: HTMLProps<HTMLElement>["className"];
	type?: "warning" | "error" | "info";
	title: ReactNode;
	subTitle?: ReactNode;
	refreshBtn?: {
		title?: string;
		onClick?: () => void;
		isRefreshing?: boolean;
		disabled?: boolean;
	};
	actionLink?: {
		title: string;
		onClick?: () => void;
	};
}

export const Banner: FC<Props> = ({ className, title, subTitle, type, refreshBtn, actionLink }) => {
	return (
		<div
			className={classNames(
				{
					"col-span-full flex flex-col rounded border-1 p-2": true,
					"border-vsc-list-warningForeground bg-vsc-inputValidation-warningBackground text-vsc-list-warningForeground": type === "warning",
					"border-vsc-list-errorForeground bg-vsc-inputValidation-errorBackground text-vsc-list-errorForeground": type === "error",
					"border-vsc-editorInfo-foreground bg-vsc-inputValidation-infoBackground text-vsc-editorInfo-foreground": type === "info",
					"bg-vsc-editorIndentGuide-background": type === undefined,
				},
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<Codicon name="warning" />
				<div className="flex-1">{title}</div>
				{actionLink && (
					<VSCodeLink
						className={classNames({
							"font-semibold text-[11px] opacity-75": true,
							"text-vsc-list-warningForeground": type === "warning",
							"text-vsc-list-errorForeground": type === "error",
							"text-vsc-editorInfo-foreground": type === "info",
						})}
						onClick={actionLink.onClick}
					>
						{actionLink.title}
					</VSCodeLink>
				)}
				{refreshBtn && (
					<Button
						appearance="icon"
						key="banner-refresh-btn"
						title={refreshBtn.title ?? "Refresh"}
						className={classNames({
							"opacity-60": true,
							"text-vsc-list-warningForeground": type === "warning",
							"text-vsc-list-errorForeground": type === "error",
							"text-vsc-editorInfo-foreground": type === "info",
						})}
						onClick={refreshBtn.onClick}
						disabled={refreshBtn.disabled || refreshBtn.isRefreshing}
					>
						<Codicon name="refresh" className={classNames(refreshBtn.isRefreshing && "animate-spin")} />
					</Button>
				)}
			</div>
			{subTitle && <p className="font-light text-[11px]">{subTitle}</p>}
		</div>
	);
};
