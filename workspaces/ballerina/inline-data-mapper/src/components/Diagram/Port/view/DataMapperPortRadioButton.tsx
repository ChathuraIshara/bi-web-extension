/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import styled from "@emotion/styled";
import { Icon } from "@wso2-enterprise/ui-toolkit";

export interface DataMapperPortRadioButtonProps {
	checked: boolean;
	disabled?: boolean;
}

function DataMapperPortRadioButton(props: DataMapperPortRadioButtonProps) {
	const { checked, disabled } = props;

	const iconSx = {
		display: "flex",
		fontSize: "15px"
	};

	if (disabled) {
		Object.assign(iconSx, {
			cursor: 'not-allowed',
			opacity: 0.5
		});
	}

	return (
		<Icon
			sx={{ height: "15px", width: "15px" }}
			iconSx={iconSx}
			name={checked ? "radio-button-checked" : "radio-button-unchecked"}
		/>
	);
}

export const RadioButtonChecked = styled(() => DataMapperPortRadioButton({ checked: true }))`
	user-select: none;
	pointer-events: auto;
`;

export const RadioButtonUnchecked = styled(({ disabled = false }) => DataMapperPortRadioButton({checked: false, disabled}))`
	user-select: none;
	pointer-events: auto;
`;
