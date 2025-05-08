/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from 'react';
import { ActionButtons, Divider, SidePanelBody, Typography, ProgressIndicator } from '@wso2-enterprise/ui-toolkit';
import { FunctionName } from './FunctionName/FunctionName';
import { FunctionReturn } from './Return/FunctionReturn';
import styled from '@emotion/styled';
import { FunctionModel, ParameterModel, PropertyModel, ReturnTypeModel } from '@wso2-enterprise/ballerina-core';
import { Parameters } from './Parameters/Parameters';
import { EditorContentColumn } from '../../styles';

export interface ResourceFormProps {
	model: FunctionModel;
	onSave: (functionModel: FunctionModel) => void;
	onClose: () => void;
}

export function FunctionForm(props: ResourceFormProps) {
	const { model, onSave, onClose } = props;

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [functionModel, setFunctionModel] = useState<FunctionModel>(model);

	useEffect(() => {
		console.log("Function Model", model);
	}, []);

	const onNameChange = (name: PropertyModel) => {
		const updatedFunctionModel = {
			...functionModel,
			name: name,
		};
		setFunctionModel(updatedFunctionModel);
		console.log("Name Change: ", updatedFunctionModel);
	}

	const handleParamChange = (params: ParameterModel[]) => {
		const updatedFunctionModel = {
			...functionModel,
			parameters: params
		};
		setFunctionModel(updatedFunctionModel);
		console.log("Parameter Change: ", updatedFunctionModel);
	};

	const handleResponseChange = (response: ReturnTypeModel) => {
		response.value = "";
		const updatedFunctionModel = {
			...functionModel,
			returnType: response
		};
		setFunctionModel(updatedFunctionModel);
		console.log("Response Change: ", updatedFunctionModel);
	};

	const handleSave = () => {
		onSave(functionModel);
	}

	return (
		<>
			{isLoading && <ProgressIndicator id="resource-loading-bar" />}
			<SidePanelBody>
				<EditorContentColumn>
					<FunctionName name={functionModel.name} onChange={onNameChange} readonly={!functionModel.name.editable} />
					<Divider />
					<Parameters parameters={functionModel.parameters} onChange={handleParamChange} canAddParameters={functionModel.canAddParameters} />
					<Typography sx={{ marginBlockEnd: 10 }} variant="h4">Returns</Typography>
					<FunctionReturn returnType={functionModel.returnType} onChange={handleResponseChange} readonly={!functionModel.returnType.editable} />
				</EditorContentColumn>
				<ActionButtons
					primaryButton={{ text: "Save", onClick: handleSave, tooltip: "Save" }}
					secondaryButton={{ text: "Cancel", onClick: onClose, tooltip: "Cancel" }}
					sx={{ justifyContent: "flex-end" }}
				/>
			</SidePanelBody>
		</>
	);
}
