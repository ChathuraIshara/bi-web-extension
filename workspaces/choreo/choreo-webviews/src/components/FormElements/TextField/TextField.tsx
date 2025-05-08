/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type { TextFieldType } from "@vscode/webview-ui-toolkit";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import classnames from "classnames";
import React, { type FC, type HTMLProps, type ReactNode } from "react";
import { type Control, Controller } from "react-hook-form";
import { FormElementWrap } from "../FormElementWrap";

interface Props {
	name?: string;
	label?: string | ReactNode;
	required?: boolean;
	loading?: boolean;
	control?: Control;
	disabled?: boolean;
	placeholder?: string;
	type?: TextFieldType;
	wrapClassName?: HTMLProps<HTMLElement>["className"];
}

export const TextField: FC<Props> = (props) => {
	const { label, required, loading, name, control, disabled, type, placeholder, wrapClassName } = props;

	if (!control) {
		return (
			<FormElementWrap label={label} required={required} loading={loading} wrapClassName={wrapClassName}>
				<VSCodeTextField
					className={classnames("w-full border-[0.5px] border-transparent")}
					disabled={disabled || loading || undefined}
					type={type}
					placeholder={placeholder}
				/>
			</FormElementWrap>
		);
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormElementWrap errorMsg={fieldState.error?.message} label={label} required={required} loading={loading} wrapClassName={wrapClassName}>
					<VSCodeTextField
						onInput={field.onChange}
						className={classnames("w-full border-[0.5px]", fieldState.error ? "border-vsc-errorForeground" : "border-transparent")}
						disabled={disabled || loading || undefined}
						type={type}
						placeholder={placeholder}
						{...field}
					/>
				</FormElementWrap>
			)}
		/>
	);
};
