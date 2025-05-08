/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import React, { type FC, type HTMLProps, type ReactNode } from "react";
import { type Control, Controller } from "react-hook-form";

interface Props {
	name?: string;
	label?: string | ReactNode;
	loading?: boolean;
	control?: Control;
	disabled?: boolean;
	className?: HTMLProps<HTMLElement>["className"];
}

export const CheckBox: FC<Props> = (props) => {
	const { label, loading, name, control, disabled, className } = props;

	if (!control) {
		return (
			<VSCodeCheckbox className={className} disabled={disabled || loading || undefined}>
				{label}
			</VSCodeCheckbox>
		);
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<VSCodeCheckbox
					className={className}
					disabled={disabled || loading || undefined}
					{...field}
					checked={field.value}
					onChange={(event: any) => field.onChange(event.target.checked)}
				>
					{label}
				</VSCodeCheckbox>
			)}
		/>
	);
};
