/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import React, { type HTMLProps, type PropsWithChildren, forwardRef } from "react";

interface Props extends PropsWithChildren {
	className?: HTMLProps<HTMLElement>["className"];
	appearance?: "primary" | "secondary" | "icon";
	title?: string;
	disabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLElement | SVGSVGElement>) => void;
}

export const Button = forwardRef<any, Props>((props, ref) => {
	const { children, disabled, ...rest } = props;

	return (
		<VSCodeButton {...rest} disabled={disabled || undefined} ref={ref}>
			{children}
		</VSCodeButton>
	);
});
Button.displayName = "Button";
