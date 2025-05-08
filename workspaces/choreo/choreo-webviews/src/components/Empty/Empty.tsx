/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, { type HTMLProps, type FC } from "react";
import { Codicon } from "../Codicon";

interface Props {
	className?: HTMLProps<HTMLElement>["className"];
	text: string;
	subText?: string;
	showIcon?: boolean;
}

export const Empty: FC<Props> = ({ text, className, subText, showIcon = true }) => {
	return (
		<div className={classNames("col-span-full flex flex-col items-center justify-center gap-3 p-8 lg:min-h-44", className)}>
			<p className="text-center font-light text-sm opacity-50">{text}</p>
			{subText && <p className="text-center font-thin text-[11px] opacity-50">{subText}</p>}
			{showIcon && <Codicon name="inbox" className="!text-4xl opacity-20" />}
		</div>
	);
};
