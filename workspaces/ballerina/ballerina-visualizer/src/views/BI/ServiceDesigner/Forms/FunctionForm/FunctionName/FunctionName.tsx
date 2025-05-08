/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { TextField } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { PropertyModel } from '@wso2-enterprise/ballerina-core';
import { ReadonlyField } from '../../../components/ReadonlyField';

const NameContainer = styled.div`
    display: flex;
	flex-direction: row;
`;

export interface FunctionNameProps {
	name: PropertyModel;
	onChange: (name: PropertyModel) => void;
	readonly?: boolean;
}

export function FunctionName(props: FunctionNameProps) {
	const { name, onChange, readonly } = props;

	const handleNameChange = (value: string) => {
		onChange({ ...name, value });
	};

	return (
		<>
			<NameContainer>
				{readonly && <ReadonlyField label="Function Name" name={name.value} />}
				{!readonly &&
					<TextField
						sx={{ flexGrow: 1 }}
						autoFocus
						errorMsg={""}
						label="Function Name"
						size={70}
						onChange={(e) => {
							const trimmedInput = e.target.value.trim();
							handleNameChange(trimmedInput);
						}}
						placeholder="foo"
						value={name.value}
						onFocus={(e) => e.target.select()}
					/>
				}
			</NameContainer>
		</>
	);
}
