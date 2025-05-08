/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, { type ReactNode } from "react";
import { Divider } from "../../Divider";

export const SectionHeader = ({ title, subTitle, alignLeft }: { title: string; subTitle?: ReactNode; alignLeft?: boolean }) => {
	return (
		<div className="mb-2">
			<div className={classNames("flex items-center gap-2 sm:gap-4", alignLeft && "flex-row-reverse")}>
				<Divider className="flex-1" />
				<h1 className={classNames("font-light text-base opacity-75", !alignLeft && "text-right")}>{title}</h1>
			</div>
			{subTitle && <h2 className={classNames("hidden font-extralight text-xs opacity-75 sm:block", !alignLeft && "text-right")}>{subTitle}</h2>}
		</div>
	);
};
