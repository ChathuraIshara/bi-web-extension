/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RequiredFormInput } from "@wso2-enterprise/ui-toolkit";
import { ProgressIndicator } from "@wso2-enterprise/ui-toolkit";
import classNames from "classnames";
import React, { type FC, type HTMLProps, type PropsWithChildren, type ReactNode } from "react";

interface Props extends PropsWithChildren {
	label?: string | ReactNode;
	required?: boolean;
	errorMsg?: string;
	loading?: boolean;
	wrapClassName?: HTMLProps<HTMLElement>["className"];
	labelWrapClassName?: HTMLProps<HTMLElement>["className"];
}

export const FormElementWrap: FC<Props> = (props) => {
	const { label, required, errorMsg, loading, wrapClassName, labelWrapClassName, children } = props;
	return (
		<div className={classNames("flex w-full flex-col", wrapClassName)}>
			<div className={classNames("flex justify-between gap-1", labelWrapClassName)}>
				<span className="flex gap-1">
					<label className="font-light">{label}</label>
					{required && <RequiredFormInput />}
				</span>
				{errorMsg && (
					<label className="line-clamp-1 flex-1 text-right text-vsc-errorForeground" title={errorMsg}>
						{errorMsg}
					</label>
				)}
			</div>
			<div className="grid grid-cols-1">{children}</div>
			{loading && (
				<div className="relative">
					<ProgressIndicator />
				</div>
			)}
		</div>
	);
};
