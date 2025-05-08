/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import type { FC, HTMLProps, PropsWithChildren } from "react";
import React from "react";

interface Props extends PropsWithChildren {
	className?: HTMLProps<HTMLElement>["className"];
}

export const BadgeSkeleton: FC = () => <Badge className="h-[18px] w-20 animate-pulse" />;

export const Badge: FC<Props> = ({ children, className }) => (
	<div className={classNames("rounded-[12px] bg-vsc-button-secondaryBackground px-2 py-0.5 text-[10px] text-vsc-badge-foreground", className)}>
		{children}
	</div>
);
