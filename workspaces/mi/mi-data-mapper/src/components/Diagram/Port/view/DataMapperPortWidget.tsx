/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";

import { DataMapperLinkModel } from "../../Link"
import { IntermediatePortModel } from "../IntermediatePort";
import { InputOutputPortModel } from "../model/InputOutputPortModel";
import { useDMExpressionBarStore } from "../../../../store/store";
import { RadioButtonChecked, RadioButtonUnchecked } from "./DataMapperPortRadioButton";

export interface DataMapperPortWidgetProps {
	engine: DiagramEngine;
	port: IntermediatePortModel | InputOutputPortModel;
	disable?: boolean;
	dataTestId?: string;
	handlePortState?: (portState: PortState) => void ;
}

export enum PortState {
	PortSelected,
	LinkSelected,
	Unselected
}

export const DataMapperPortWidget: React.FC<DataMapperPortWidgetProps> = (props: DataMapperPortWidgetProps) =>  {
	const { engine, port, disable, dataTestId, handlePortState } = props;
	const [ portState, setPortState ] = useState<PortState>(PortState.Unselected);
	const [ disableNewLinking, setDisableNewLinking] = useState<boolean>(false);

	const isDisabled = disable || (port instanceof InputOutputPortModel && port.isDisabled());

	const { setExprBarFocusedPort, setExprBarInputPort, resetExprBarFocus } = useDMExpressionBarStore(state => ({
		setExprBarFocusedPort: state.setFocusedPort,
		setExprBarInputPort: state.setInputPort,
		resetExprBarFocus: state.resetFocus
	}));

	const hasLinks = Object.entries(port.links).length > 0;
	const pendingMappingType = port instanceof InputOutputPortModel && port.pendingMappingType;
	const isPortSelected = portState === PortState.PortSelected;

	const hasError = Object.entries(port.links).some((link) => {
		if (link[1] instanceof DataMapperLinkModel){
			return link[1].hasError();
		}
		return false;
	});

	const addExprBarFocusedPort = () => {
		if (port instanceof InputOutputPortModel && port.portType === "IN") {
			setExprBarFocusedPort(port);
		}
	};

	const addToExpressionBar = () => {
		if (port instanceof InputOutputPortModel && port.portType === "OUT") {
			setExprBarInputPort(port);
		}
	};

	useEffect(() => {
			port.registerListener({
				eventDidFire(event) {
					if (event.function === "mappingStartedFrom" || event.function === "mappingFinishedTo") {
						setPortState(PortState.PortSelected);
						if (handlePortState) {
							handlePortState(PortState.PortSelected);
							resetExprBarFocus();
						}
					} else if (event.function === "link-selected") {
						setPortState(PortState.LinkSelected);
						if (handlePortState) {
							handlePortState(PortState.LinkSelected);
							resetExprBarFocus();
						}
					} else if (event.function === "link-unselected"
						|| event.function === "mappingStartedFromSelectedAgain"
						|| event.function === "link-removed"
					) {
						setPortState(PortState.Unselected);
						if (handlePortState) {
							handlePortState(PortState.Unselected);
						}
						resetExprBarFocus();
					} else if (event.function === "expressionBarFocused") {
						addExprBarFocusedPort();
					} else if (event.function === "addToExpression") {
						addToExpressionBar();
					}
				},
			})
	}, []);

	useEffect(() => {
		port.registerListener({
			eventDidFire(event) {
				if (event.function === "disableNewLinking") {
					setDisableNewLinking(true);
				} else if (event.function === "enableNewLinking") {
					setDisableNewLinking(false);
				}
			},
		})
	}, []);

	let portColor = defaultPortColor;
	if (pendingMappingType) {
		portColor = tempLinkPortColor;
	} else if (isPortSelected) {
		portColor = portActiveColor;
	} else if (hasLinks) {
		portColor = hasError ? errorPortColor : portActiveColor;
	}

	const containerProps = {
		'data-testid': dataTestId,
		active: isPortSelected,
		color: portColor
	};

	if (isDisabled) {
		return <RadioButtonUnchecked disabled={isDisabled} data-testid={dataTestId}/>;
	} else if (disableNewLinking) {
		return (
			<PortWidget
				port={port}
				engine={engine}
			>
				<DisabledNewLinkingPortContainer {...containerProps}>
					{hasLinks ? <RadioButtonChecked /> : <RadioButtonUnchecked /> }
				</DisabledNewLinkingPortContainer>
			</PortWidget>
		);
	}

	const isChecked = hasLinks || isPortSelected || !!pendingMappingType;

	return (
		<PortWidget
			port={port}
			engine={engine}
		>
			<ActivePortContainer {...containerProps}>
				{isChecked ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
			</ActivePortContainer>
		</PortWidget>
	);
}

interface PortsContainerProps {
	active: boolean;
	color: string;
}

const defaultPortColor = "var(--vscode-foreground)";
const tempLinkPortColor = "var(--vscode-debugIcon-breakpointDisabledForeground)";
const errorPortColor = "var(--vscode-errorForeground)";
const portActiveColor = "var(--vscode-list-focusAndSelectionOutline, var(--vscode-contrastActiveBorder, var(--vscode-editorLink-activeForeground, var(--vscode-list-focusOutline))))";

const ActivePortContainer = styled.div((props: PortsContainerProps) => ({
	cursor: "pointer",
	display: "flex",
	strokeOpacity: props.active ? 0.1 : 0,
	color: props.color,
	"&:hover": {
		color: portActiveColor
	}
}));

const DisabledNewLinkingPortContainer = styled.div((props: PortsContainerProps) => ({
	cursor: "not-allowed",
	display: "flex",
	color: props.color,
}));
