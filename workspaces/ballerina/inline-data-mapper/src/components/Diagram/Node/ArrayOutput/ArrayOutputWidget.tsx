/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { DiagramEngine } from '@projectstorm/react-diagrams';
import { Button, Codicon, ProgressRing } from "@wso2-enterprise/ui-toolkit";
import { IOType } from '@wso2-enterprise/ballerina-core';
import classnames from "classnames";

import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { DataMapperPortWidget, PortState, InputOutputPortModel } from '../../Port';
import { TreeBody, TreeContainer, TreeHeader } from '../commons/Tree/Tree';
import { ArrayOutputFieldWidget } from "./ArrayOuptutFieldWidget";
import { useIONodesStyles } from '../../../styles';
import { useDMCollapsedFieldsStore, useDMIOConfigPanelStore } from "../../../../store/store";
import { OutputSearchHighlight } from "../commons/Search";
import FieldActionWrapper from "../commons/FieldActionWrapper";
import { ValueConfigMenu, ValueConfigMenuItem, ValueConfigOption } from "../commons/ValueConfigButton";
import { OutputBeforeInputNotification } from "../commons/OutputBeforeInputNotification";

export interface ArrayOutputWidgetProps {
	id: string;
	outputType: IOType;
	typeName: string;
	engine: DiagramEngine;
	isBodyArrayLitExpr: boolean;
	getPort: (portId: string) => InputOutputPortModel;
	context: IDataMapperContext;
	valueLabel?: string;
}

export function ArrayOutputWidget(props: ArrayOutputWidgetProps) {
	const {
		id,
		outputType,
		getPort,
		engine,
		isBodyArrayLitExpr,
		context,
		typeName,
		valueLabel
	} = props;

	const classes = useIONodesStyles();

	const [portState, setPortState] = useState<PortState>(PortState.Unselected);
	const [isLoading, setLoading] = useState(false);
	const [hasOutputBeforeInput, setHasOutputBeforeInput] = useState(false);

	const collapsedFieldsStore = useDMCollapsedFieldsStore();

	const { setIsIOConfigPanelOpen, setIOConfigPanelType, setIsSchemaOverridden } = useDMIOConfigPanelStore(state => ({
		setIsIOConfigPanelOpen: state.setIsIOConfigPanelOpen,
		setIOConfigPanelType: state.setIOConfigPanelType,
		setIsSchemaOverridden: state.setIsSchemaOverridden
	})); 

	const { model: { mappings }, applyModifications } = context;

	const mapping = mappings[0]; // There is only one root level mapping for array output
	const hasValue = mappings.length > 0;
	const elements = isBodyArrayLitExpr ? mapping.elements : [];

	const isRootArray = context.views.length == 1;

	const portIn = getPort(`${id}.IN`);

	let expanded = true;
	if ((portIn && portIn.collapsed)) {
		expanded = false;
	}

	const indentation = (portIn && (!hasValue || !expanded)) ? 0 : 24;
	const shouldPortVisible = !hasValue || !expanded || !isBodyArrayLitExpr || elements.length === 0;
	const hasElementConnectedViaLink = elements.some(expr => expr.mappings.some(m => m.inputs.length > 0));

	let isDisabled = portIn?.descendantHasValue;
	if (expanded && !isDisabled && elements.length > 0) {
		portIn.setDescendantHasValue();
		isDisabled = true;
	} else if (!expanded && !hasElementConnectedViaLink && !isDisabled && elements.length > 0) {
		isDisabled = true;
	}

	const handleExpand = () => {
		const collapsedFields = collapsedFieldsStore.fields;
		if (!expanded) {
			collapsedFieldsStore.setFields(collapsedFields.filter((element) => element !== id));
		} else {
			collapsedFieldsStore.setFields([...collapsedFields, id]);
		}
	};

	const handlePortState = (state: PortState) => {
		setPortState(state)
	};

	const handlePortSelection = (outputBeforeInput: boolean) => {
		setHasOutputBeforeInput(outputBeforeInput);
	};

	const handleArrayInitialization = async () => {
		setLoading(true);
		try {
			// TODO: Implement array initialization
		} finally {
			setLoading(false);
		}
	};

	const handleArrayDeletion = async () => {
		setLoading(true);
		try {
			// TODO: Implement array deletion
		} finally {
			setLoading(false);
		}
	};

	const handleEditValue = () => {
		// TODO: Implement edit value
	};

	const onRightClick = (event: React.MouseEvent) => {
		event.preventDefault();
		setIOConfigPanelType("Output");
		setIsSchemaOverridden(true);
		setIsIOConfigPanelOpen(true);
	};

	const label = (
		<span style={{ marginRight: "auto" }}>
			{valueLabel && (
				<span className={classes.valueLabel}>
					<OutputSearchHighlight>{valueLabel}</OutputSearchHighlight>
					{typeName && ":"}
				</span>
			)}
			<span className={classnames(classes.outputTypeLabel, isDisabled ? classes.labelDisabled : "")}>
				{typeName || ''}
			</span>
		</span>
	);

	const valConfigMenuItems: ValueConfigMenuItem[] = [
		...(isRootArray && Object.keys(portIn.links).length === 0
			? [{
				title: ValueConfigOption.InitializeArray,
				onClick: handleArrayInitialization
			}]
			: [
				// {
				// 	title: ValueConfigOption.EditValue,
				// 	onClick: handleEditValue
				// }
				// TODO: Add edit value option once the feature is implemented
			])
	];

	return (
		<>
			<TreeContainer data-testid={`${id}-node`} onContextMenu={onRightClick}>
				<TreeHeader
					isSelected={portState !== PortState.Unselected}
					isDisabled={isDisabled} id={"recordfield-" + id}
				>
					<span className={classes.inPort}>
						{portIn && shouldPortVisible && (
							<DataMapperPortWidget
								engine={engine}
								port={portIn}
								disable={isDisabled}
								handlePortState={handlePortState}
								hasFirstSelectOutput={handlePortSelection}
							/>
						)}
					</span>
					<span className={classes.label}>
						<FieldActionWrapper>
							<Button
								id={"expand-or-collapse-" + id} 
								appearance="icon"
								tooltip="Expand/Collapse"
								onClick={handleExpand}
								data-testid={`${id}-expand-icon-mapping-target-node`}
								sx={{ marginLeft: indentation }}
							>
								{expanded ? <Codicon name="chevron-down" /> : <Codicon name="chevron-right" />}
							</Button>
						</FieldActionWrapper>
						{label}
					</span>
					{(isLoading) ? (
						<ProgressRing />
					) : (((hasValue && !hasElementConnectedViaLink) || !isDisabled) && (
						<FieldActionWrapper>
							<ValueConfigMenu
								menuItems={valConfigMenuItems}
								isDisabled={!typeName}
								portName={portIn?.getName()}
							/>
						</FieldActionWrapper>
					))}
					{hasOutputBeforeInput && <OutputBeforeInputNotification />}
				</TreeHeader>
				{expanded && outputType && isBodyArrayLitExpr && (
					<TreeBody>
						<ArrayOutputFieldWidget
							key={id}
							engine={engine}
							field={outputType}
							getPort={getPort}
							parentId={id}
							context={context}
							asOutput={true}
						/>
					</TreeBody>
				)}
			</TreeContainer>
		</>
	);
}
