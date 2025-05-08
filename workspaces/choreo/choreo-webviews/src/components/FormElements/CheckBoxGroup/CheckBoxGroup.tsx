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
import { FormElementWrap } from "../FormElementWrap";

interface Props {
	name?: string;
	label?: string | ReactNode;
	loading?: boolean;
	control?: Control;
	disabled?: boolean;
	className?: HTMLProps<HTMLElement>["className"];
	items?: ({ value: string; label?: string } | string)[];
	wrapClassName?: HTMLProps<HTMLElement>["className"];
	required?: boolean;
}

export const CheckBoxGroup: FC<Props> = (props) => {
	const { label, loading, name, control, disabled, className, required, wrapClassName, items = [] } = props;

	if (!control) {
		return (
			<FormElementWrap label={label} required={required} loading={loading} wrapClassName={wrapClassName}>
				<div className="flex flex-wrap gap-2">
					{items.map((item) => (
						<VSCodeCheckbox key={typeof item === "string" ? item : item?.value} className={className} disabled={disabled || loading || undefined}>
							{label}
						</VSCodeCheckbox>
					))}
				</div>
			</FormElementWrap>
		);
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormElementWrap
					errorMsg={fieldState.error?.message}
					label={label}
					required={required}
					loading={loading}
					wrapClassName={wrapClassName}
					labelWrapClassName="mb-[1px]"
				>
					<div className="flex flex-wrap gap-2">
						{items.map((item) => {
							const value = typeof item === "string" ? item : item?.value;
							const label = typeof item === "string" ? item : item?.label || item.value;

							return (
								<VSCodeCheckbox
									key={value}
									className={className}
									disabled={disabled || loading || undefined}
									{...field}
									defaultChecked={field.value?.includes(value)}
									onChange={(event: any) => {
										if (event.target.checked) {
											if (!field.value?.some((item: string) => item === value)) {
												field.onChange([...field.value, value]);
											}
										} else {
											field.onChange(field.value?.filter((item: string) => item !== value));
										}
									}}
								>
									{label}
								</VSCodeCheckbox>
							);
						})}
					</div>
				</FormElementWrap>
			)}
		/>
	);
};
