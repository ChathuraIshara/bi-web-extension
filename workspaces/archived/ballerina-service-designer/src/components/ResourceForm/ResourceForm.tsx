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
import { ActionButtons, Button, Divider, LinkButton, SidePanel, SidePanelBody, SidePanelTitleContainer, Typography, ProgressIndicator } from '@wso2-enterprise/ui-toolkit';
import { ResourcePath } from '../ResourcePath/ResourcePath';
import { ResourceResponse } from '../ResourceResponse/ResourceResponse';
import { ResourceParam } from '../ResourceParam/ResourceParam';
import { Payload } from '../Payload/Payload';
import { AdvancedParams } from '../AdvancedParam/AdvancedParam';
import styled from '@emotion/styled';
import { HTTP_METHOD, generateNewResourceFunction, updateResourceFunction } from '../../utils/utils';
import { NodePosition } from '@wso2-enterprise/syntax-tree';
import { CommonRPCAPI, Diagnostic, STModification } from '@wso2-enterprise/ballerina-core';
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { debounce } from "lodash";
import { useServiceDesignerContext } from '../../Context';
import { PARAM_TYPES, ParameterConfig, Resource, ResponseConfig } from '../../utils/definitions';

const AdvancedParamTitleWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

export interface ResourceFormProps {
	isOpen: boolean;
	isBallerniaExt?: boolean;
	resourceConfig?: Resource;
	onSave?: (source: string, config: Resource, updatePosition?: NodePosition) => void;
	getRecordST?: (recordName: string) => void;
	addNameRecord?: (source: string) => void;
	commonRpcClient?: CommonRPCAPI;
	onClose: () => void;
	applyModifications?: (modifications: STModification[]) => Promise<void>;
}

export function ResourceForm(props: ResourceFormProps) {
	const { isOpen, isBallerniaExt, resourceConfig, onClose, onSave, addNameRecord, commonRpcClient, applyModifications } = props;

	const [method, setMethod] = useState<HTTP_METHOD>(resourceConfig?.methods[0].toUpperCase() as HTTP_METHOD || HTTP_METHOD.GET);
	const [path, setPath] = useState<string>(resourceConfig?.path || "path");

	const [parameters, setParameters] = useState<ParameterConfig[]>(resourceConfig?.params || []);
	const [advancedParams, setAdvancedParam] = useState<Map<string, ParameterConfig>>(resourceConfig?.advancedParams || new Map<string, ParameterConfig>());
	const [showAdvanced, setShowAdvanced] = useState<boolean>(advancedParams?.size > 0);
	const [payload, setPayload] = useState<ParameterConfig | undefined>(resourceConfig?.payloadConfig);
	const [response, setResponse] = useState<ResponseConfig[]>(resourceConfig?.responses || []);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { diagnostics, setDiagnostics, setDPosition, serviceEndPosition } = useServiceDesignerContext();

	const { rpcClient } = useRpcContext();

	useEffect(() => {
		setDPosition(resourceConfig?.updatePosition || serviceEndPosition); // Setting the position of the resource into the context so that we can use it in filtering diagnostic msgs.
	}, []);

	useEffect(() => {
		debouncedHandleDiagnostics();
		return () => {
			debouncedHandleDiagnostics.cancel();
		};
	}, [method, path, parameters, advancedParams, payload, response]);

	const handleParamChange = (params: ParameterConfig[]) => {
		setParameters(params);
	};

	const handleAdvanceParamToggle = () => {
		setShowAdvanced(!showAdvanced);
	};

	const handleAdvancedParamChange = (params: Map<string, ParameterConfig>) => {
		setAdvancedParam(params);
	};

	const handleResponseChange = (resp: ResponseConfig[]) => {
		setResponse(resp);
	};

	const handlePayloadChange = (params: ParameterConfig) => {
		setPayload(params);
	};

	const onPathChange = (method: string, path: string) => {
		setMethod(method as HTTP_METHOD);
		setPath(path);
	}

	const handleDiagnostics = async () => {
		setIsLoading(true);
		const source = generateSource();
		let position = { ...serviceEndPosition };
		position.endColumn = 0;
		if (resourceConfig?.updatePosition) {
			position = resourceConfig?.updatePosition
		}
		const diag = await rpcClient.getCommonRpcClient().getBallerinaDiagnostics(
			{
				ballerinaSource: source,
				targetPosition: position,
				skipSemiColon: true,
				checkSeverity: 1
			});
		if (diag?.diagnostics.length > 0 && haveValidDiagnostics(diag.diagnostics)) {
			setDiagnostics(diag.diagnostics);
		} else {
			setDiagnostics([]);
		}
		setIsLoading(false);
	}

	const haveValidDiagnostics = (diagnostics: Diagnostic[]) => {
		const skip = ["BCE2095"];
		return !diagnostics.some(diagnostic => skip.includes(diagnostic.code as string));
	}
	const debouncedHandleDiagnostics = debounce(handleDiagnostics, 500);

	const generateSource = () => {
		// Generate the ballerina resource source
		let paramString = "";

		let advancedParamIndex = 0;
		advancedParams?.forEach((param: ParameterConfig) => {
			const type = param.option === PARAM_TYPES.HEADER ? `http:${PARAM_TYPES.HEADER}s` : param.type;
			paramString += `${type}${param.isRequired || param.option === PARAM_TYPES.HEADER ? "" : "?"} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ""}${advancedParamIndex === advancedParams.size - 1 ? "" : ", "}`;
			advancedParamIndex++;
		});
		paramString += (advancedParams.size > 0 && parameters.length > 0) ? ", " : "";

		if (payload) {
			const payloadType = `@http:${PARAM_TYPES.PAYLOAD} ${payload.type} ${payload.name}${payload.defaultValue ? ` = ${payload.defaultValue}` : ""} ${(advancedParams.size > 0 || parameters.length > 0) ? ", " : ""}`;
			paramString += payloadType;
		}

		parameters.map((param: ParameterConfig, index: number) => {
			const type = param.option === PARAM_TYPES.HEADER ? ` @http:${PARAM_TYPES.HEADER} ${param.type}` : param.type;
			paramString += `${type}${param.isRequired ? "" : "?"} ${param.name}${param.defaultValue ? ` = ${param.defaultValue}` : ""}${index === parameters.length - 1 ? "" : ", "}`;
		});


		let responseString = "";
		response.map((resp: ResponseConfig, index: number) => {
			if (resp?.source) {
				responseString += `${resp?.source}${index === response.length - 1 ? "" : " | "}`;
			}
		});

		if (!resourceConfig?.updatePosition) {
			return generateNewResourceFunction({ METHOD: method.toLocaleLowerCase(), PATH: path, PARAMETERS: paramString, ADD_RETURN: responseString });
		} else {
			return updateResourceFunction({ METHOD: method.toLocaleLowerCase(), PATH: path, PARAMETERS: paramString, ADD_RETURN: responseString });
		}
	}

	const handleSave = () => {
		const genSource = generateSource();
		const config = {
			methods: [method],
			path: path,
			params: parameters,
			advancedParams: advancedParams,
			payloadConfig: payload,
			responses: response
		};
		// Insert scenario
		if (!resourceConfig?.updatePosition) {
			// Insert scenario
			onSave && onSave(genSource, config);
		} else {
			// Edit scenario
			onSave && onSave(genSource, config, resourceConfig?.updatePosition);
		}
		onClose();
	};

	return (
		<>
			<SidePanel
				isOpen={isOpen}
				alignment="right"
				sx={{ 
					width: 600,
					boxShadow: "none" 
				}}
			>
				{isLoading && <ProgressIndicator id="resource-loading-bar" />}
				<SidePanelTitleContainer>
					<Typography sx={{ margin: 0 }} variant="h3">Configure Resource</Typography>
					<Button onClick={onClose} appearance="icon">X</Button>
				</SidePanelTitleContainer>

				<SidePanelBody>
					<ResourcePath method={method} path={path} onChange={onPathChange} />

					<Divider />

					<Typography sx={{ marginBlockEnd: 10 }} variant="h4">Parameters</Typography>
					<ResourceParam parameters={parameters} onChange={handleParamChange} />
					{method !== HTTP_METHOD.GET && <Payload parameter={payload!} onChange={handlePayloadChange} />}
					<AdvancedParamTitleWrapper>
						<Typography sx={{ marginBlockEnd: 10 }} variant="h4">Advanced Parameters</Typography>
						<LinkButton sx={{ marginTop: 12, marginLeft: 8 }} onClick={handleAdvanceParamToggle}> {showAdvanced ? "Hide" : "Show"} </LinkButton>
					</AdvancedParamTitleWrapper>
					{showAdvanced && <AdvancedParams parameters={advancedParams} onChange={handleAdvancedParamChange} />}

					<Divider />

					<Typography sx={{ marginBlockEnd: 10 }} variant="h4">Responses</Typography>
					<ResourceResponse method={method} addNameRecord={addNameRecord} response={response} onChange={handleResponseChange} serviceEndPosition={serviceEndPosition} commonRpcClient={commonRpcClient} isBallerniaExt={isBallerniaExt} applyModifications={applyModifications} />

					<ActionButtons
						primaryButton={{ text: "Save", onClick: handleSave, tooltip: "Save", disabled: diagnostics.length > 0 }}
						secondaryButton={{ text: "Cancel", onClick: onClose, tooltip: "Cancel" }}
						sx={{ justifyContent: "flex-end" }}
					/>
				</SidePanelBody>

			</SidePanel>
		</>
	);
}
