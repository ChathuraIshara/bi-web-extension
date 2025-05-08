/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { type HTMLProps, type FC } from "react";
import SwaggerUIReact, { type SwaggerUIProps } from "swagger-ui-react";
import "@wso2-enterprise/ui-toolkit/src/styles/swagger/main.scss";
import classNames from "classnames";
import { Codicon } from "../Codicon/Codicon";
import { SkeletonText } from "../SkeletonText";

export const SwaggerUI: FC<SwaggerUIProps> = (props) => {
	return <SwaggerUIReact {...props} />;
};

export const SwaggerUISkeleton: FC<{ className?: HTMLProps<HTMLElement>["className"] }> = ({ className }) => {
	return (
		<div className={classNames("my-5 flex w-full flex-col gap-4", className)}>
			{Array.from(new Array(10)).map((_, index) => (
				<div key={index} className="flex h-9 animate-pulse items-center gap-3 rounded border-1 border-vsc-button-secondaryBackground p-1">
					<div className="h-full w-20 bg-vsc-button-secondaryBackground" />
					<div className="flex-1">
						<SkeletonText className={index % 2 === 0 ? "w-1/2" : "w-2/5"} />
					</div>
					<Codicon name="chevron-down" className="text-vsc-button-secondaryBackground" />
				</div>
			))}
		</div>
	);
};
