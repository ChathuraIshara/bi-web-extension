/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from 'react';
import { Codicon, Dropdown, LinkButton, TextField } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { PropertyModel } from '@wso2-enterprise/ballerina-core';
import { parseResourcePath, SegmentParam } from '../Utils/ResourcePathParser';

const verbs = [
	{
		content: 'GET',
		id: 'GET',
		value: 'GET'
	},
	{
		content: 'POST',
		id: 'POST',
		value: 'POST'
	},
	{
		content: 'PUT',
		id: 'PUT',
		value: 'PUT'
	},
	{
		content: 'DELETE',
		id: 'DELETE',
		value: 'DELETE'
	},
	{
		content: 'PATCH',
		id: 'PATCH',
		value: 'PATCH'
	},
	{
		content: 'DEFAULT',
		id: 'DEFAULT',
		value: 'DEFAULT'
	}
];

const PathContainer = styled.div`
    display: flex;
	flex-direction: row;
`;

const AddButtonWrapper = styled.div`
    display: flex;
	justify-content: flex-end;
	margin: 8px 0;
`;

export interface ResourcePathProps {
	path: PropertyModel;
	method: PropertyModel;
	onChange: (method: PropertyModel, path: PropertyModel) => void;
	onError: (hasErros: boolean) => void;
}

export function ResourcePath(props: ResourcePathProps) {
	const { method, path, onChange, onError } = props;

	const [inputValue, setInputValue] = useState('');
	const [resourcePathErrors, setResourcePathErrors] = useState<string>("");

	useEffect(() => {
		const resourePathStr = path.value ? path.value : "";
		onError(!resourePathStr);
		setInputValue(resourePathStr);
	}, []);

	const handleMethodChange = (value: string) => {
		onChange({ ...method, value: value.toLowerCase() }, path);
	};

	const handlePathChange = (value: string) => {
		setInputValue(value);
		onChange(method, { ...path, value });
	};

	const handleBlur = () => {
		const { errors, valid, segments } = parseResourcePath(inputValue);
		if (errors.length > 0) {
			onError(true);
			setResourcePathErrors(errors[0].message);
			return;
		}

		let allPathParams: string[] = [];
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (segment.type === 'param') {
				const param = segment as SegmentParam;
				const paramName = param.paramName;
				if (paramName && allPathParams.includes(paramName)) {
					onError(true);
					setResourcePathErrors(`Duplicate path parameter: ${paramName}`);
					return;
				}
				allPathParams.push(paramName);
			}
		}
		setResourcePathErrors("");
		onError(false);
	}

	const handlePathAdd = () => {
		const value = !path.value || path.value == '' ? '[string param]' : `${path.value}/[string param]`;
		setInputValue(value);
		onChange(method, { ...path, value });
	};


	return (
		<>
			<PathContainer>
				<div
					style={{
						width: 160,
						marginTop: -1.3
					}}
				>
					<Dropdown
						sx={{ width: 160 }}
						isRequired
						errorMsg=""
						id="drop-down"
						items={verbs}
						label="HTTP Method"
						onValueChange={handleMethodChange}
						value={method.value.toUpperCase() || method.placeholder.toUpperCase()}
					/>
				</div>
				<TextField
					sx={{ marginLeft: 15, flexGrow: 1 }}
					autoFocus
					required
					errorMsg={resourcePathErrors}
					label="Resource Path"
					size={70}
					onTextChange={(input) => {
						const trimmedInput = input.startsWith('/') ? input.slice(1) : input;
						handlePathChange(trimmedInput);
					}}
					onBlur={handleBlur}
					placeholder="path/foo"
					value={path.value}
					onFocus={(e) => e.target.select()}
				/>
			</PathContainer>
			<AddButtonWrapper>
				<LinkButton onClick={handlePathAdd} >
					<Codicon name="add" />
					<>Add Path Param</>
				</LinkButton>
			</AddButtonWrapper>
		</>
	);
}
