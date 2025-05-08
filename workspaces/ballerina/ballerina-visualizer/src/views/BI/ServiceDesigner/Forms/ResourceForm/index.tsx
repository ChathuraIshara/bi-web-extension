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
import { ResourcePath } from './ResourcePath/ResourcePath';
import { ResourceResponse } from './ResourceResponse/ResourceResponse';
import styled from '@emotion/styled';
import { HTTP_METHOD } from '../../utils';
import { FunctionModel, ParameterModel, PropertyModel, ReturnTypeModel } from '@wso2-enterprise/ballerina-core';
import { Parameters } from './Parameters/Parameters';

const AdvancedParamTitleWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

export interface ResourceFormProps {
	model: FunctionModel;
	isSaving: boolean;
	onSave: (functionModel: FunctionModel) => void;
	onClose: () => void;
}

export function ResourceForm(props: ResourceFormProps) {
	const { model, isSaving, onSave, onClose } = props;

	const [functionModel, setFunctionModel] = useState<FunctionModel>(model);
	const [isPathValid, setIsPathValid] = useState<boolean>(false);

	useEffect(() => {
		console.log("Function Model", model);
	}, []);

	const onPathChange = (method: PropertyModel, path: PropertyModel) => {
		const updatedFunctionModel = {
			...functionModel,
			accessor: method,
			name: path,
		};
		setFunctionModel(updatedFunctionModel);
		console.log("Path,Method Change: ", updatedFunctionModel);
	}

	const onResourcePathError = (hasErros: boolean) => {
		setIsPathValid(!hasErros);
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
		console.log("Saved Resource", functionModel);
		onSave(functionModel);
	}

	return (
		<>
			{isSaving && <ProgressIndicator id="resource-loading-bar" />}
			<SidePanelBody>
				<ResourcePath method={functionModel.accessor} path={functionModel.name} onChange={onPathChange}
					onError={onResourcePathError} />
				<Divider />
				<Parameters showPayload={(functionModel.accessor.value && functionModel.accessor.value.toUpperCase() !== "GET")} parameters={functionModel.parameters} onChange={handleParamChange} schemas={functionModel.schema} />
				<Typography sx={{ marginBlockEnd: 10 }} variant="h4">Responses</Typography>
				<ResourceResponse method={functionModel.accessor.value.toUpperCase() as HTTP_METHOD} response={functionModel.returnType} onChange={handleResponseChange} />
				<ActionButtons
					primaryButton={{ text: isSaving ? "Saving..." : "Save", onClick: handleSave, tooltip: isSaving ? "Saving..." : "Save", disabled: !isPathValid || isSaving }}
					secondaryButton={{ text: "Cancel", onClick: onClose, tooltip: "Cancel" }}
					sx={{ justifyContent: "flex-end" }}
				/>
			</SidePanelBody>
		</>
	);
}
