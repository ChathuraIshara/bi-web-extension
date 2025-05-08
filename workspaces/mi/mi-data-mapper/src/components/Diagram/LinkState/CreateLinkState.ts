/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { KeyboardEvent, MouseEvent } from 'react';

import { Action, ActionEvent, InputType, State } from '@projectstorm/react-canvas-core';
import { DiagramEngine, LinkModel, PortModel } from '@projectstorm/react-diagrams-core';

import { ExpressionLabelModel } from "../Label";
import { LinkConnectorNode } from '../Node';
import { InputOutputPortModel, MappingType } from '../Port/model/InputOutputPortModel';
import { IntermediatePortModel } from '../Port/IntermediatePort';
import { isInputNode, isLinkModel, isOutputNode } from '../Actions/utils';
import { useDMExpressionBarStore } from '../../../store/store';
import { OBJECT_OUTPUT_FIELD_ADDER_TARGET_PORT_PREFIX } from '../utils/constants';
import { getMappingType, isPendingMappingRequired } from '../utils/common-utils';
import { DataMapperLinkModel } from '../Link/DataMapperLink';
import { removePendingMappingTempLinkIfExists } from '../utils/link-utils';
import { DataMapperNodeModel } from '../Node/commons/DataMapperNode';
/**
 * This state is controlling the creation of a link.
 */
export class CreateLinkState extends State<DiagramEngine> {
	sourcePort: PortModel;
	link: LinkModel;
	temporaryLink: LinkModel;

	constructor(resetState: boolean = false) {
		super({ name: 'create-new-link' });

		if (resetState) {
			this.clearState();
		}

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (actionEvent: ActionEvent<MouseEvent>) => {
					let element = this.engine.getActionEventBus().getModelForEvent(actionEvent);
					const isExpandOrCollapse = (actionEvent.event.target as Element)
						.closest('div[id^="expand-or-collapse"]');
					const { focusedPort, focusedFilter } = useDMExpressionBarStore.getState();
					const isExprBarFocused = focusedPort || focusedFilter;

					if (element === null || isExpandOrCollapse) {
						this.clearState();
					} else if (!(element instanceof PortModel)) {
						if (isOutputNode(element)) {
							const targetElement = actionEvent.event.target as Element;
							const recordFieldElement = targetElement.closest('div[id^="recordfield"]');
							const isNotFieldAction = targetElement.closest('[data-field-action]') == null;
							if (recordFieldElement && isNotFieldAction) {
								const fieldId = (recordFieldElement.id.split("-"))[1] + ".IN";
								const portModel = (element as any).getPort(fieldId) as InputOutputPortModel;
								if (portModel) {
									element = portModel;
								}
							}
						}

						if (isInputNode(element)) {
							const targetElement = actionEvent.event.target as Element;
							const isFieldAction = targetElement.closest('[data-field-action]');
							if (isFieldAction) return;
							const recordFieldElement = targetElement.closest('div[id^="recordfield"]');
							if (recordFieldElement) {
								const fieldId = (recordFieldElement.id.split("-"))[1] + ".OUT";
								const portModel = (element as any).getPort(fieldId) as InputOutputPortModel;
								if (portModel) {
									element = portModel;
								}
							}
						}

						if (isLinkModel(element)) {
							element = (element as DataMapperLinkModel).getTargetPort();
						}
					}

					if (this.temporaryLink) {
						removePendingMappingTempLinkIfExists(this.temporaryLink);
						this.temporaryLink = undefined;
					}

					if (isExprBarFocused && element instanceof InputOutputPortModel && element.portType === "OUT") {
						element.fireEvent({}, "addToExpression");
						this.clearState();
						this.eject();
					} else if (element instanceof PortModel && !this.sourcePort) {
						if (element instanceof InputOutputPortModel) {
							if (element.portType === "OUT") {
								this.sourcePort = element;
								element.fireEvent({}, "mappingStartedFrom");
								element.linkedPorts.forEach((linkedPort) => {
									linkedPort.fireEvent({}, "disableNewLinking")
								})
								const link = this.sourcePort.createLinkModel();
								link.setSourcePort(this.sourcePort);
								link.addLabel(new ExpressionLabelModel({
									link: link as DataMapperLinkModel,
									value: undefined,
									context: (element.getNode() as DataMapperNodeModel).context
								}));
								this.link = link;
							} else {
								if (element.portName === OBJECT_OUTPUT_FIELD_ADDER_TARGET_PORT_PREFIX) {
									element.fireEvent({}, "firstClickedOnDynamicOutput");
								} else {
									element.fireEvent({}, "expressionBarFocused");
								}
								this.clearState();
								this.eject();
							}
						}
					} else if (element instanceof PortModel && this.sourcePort && element !== this.sourcePort) {
						if ((element instanceof InputOutputPortModel)
							|| (element instanceof IntermediatePortModel
								&& element.getParent() instanceof LinkConnectorNode)
						) {
							if (element.portType === "IN") {
								let isDisabled = false;
								if (element instanceof InputOutputPortModel) {
									isDisabled = element.isDisabled();
								}
								if (!isDisabled) {
									element.fireEvent({}, "mappingFinishedTo");
									if (this.sourcePort.canLinkToPort(element)) {

										this.link?.setTargetPort(element);

										const connectingMappingType = getMappingType(this.sourcePort, element);
										if (isPendingMappingRequired(connectingMappingType)) {
											const label = this.link.getLabels()
												.find(label => label instanceof ExpressionLabelModel) as ExpressionLabelModel;
											label.setPendingMappingType(connectingMappingType);
											this.temporaryLink = this.link;
										}

										this.engine.getModel().addAll(this.link)
										if (this.sourcePort instanceof InputOutputPortModel) {
											this.sourcePort.linkedPorts.forEach((linkedPort) => {
												linkedPort.fireEvent({}, "enableNewLinking")
											})
										}
										this.clearState();
										this.eject();
									}
								}
							} else {
								// Selected another input port, change selected port
								this.sourcePort.fireEvent({}, "link-unselected");
								if (this.sourcePort instanceof InputOutputPortModel) {
									this.sourcePort.linkedPorts.forEach((linkedPort) => {
										linkedPort.fireEvent({}, "enableNewLinking")
									})
								}
								this.sourcePort.removeLink(this.link);
								this.sourcePort = element;
								this.link?.setSourcePort(element);
								element.fireEvent({}, "mappingStartedFrom");
								if (element instanceof InputOutputPortModel) {
									element.linkedPorts.forEach((linkedPort) => {
										linkedPort.fireEvent({}, "disableNewLinking")
									})
								}
							}
						}
					} else if (element === this.link?.getLastPoint()) {
						this.link?.point(0, 0, -1);
					} else if (element === this.sourcePort) {
						element.fireEvent({}, "mappingStartedFromSelectedAgain");
						if (element instanceof InputOutputPortModel) {
							element.linkedPorts.forEach((linkedPort) => {
								linkedPort.fireEvent({}, "enableNewLinking")
							})
						}
						this.link?.remove();
						this.clearState();
						this.eject();
					} else {
						console.log("Invalid element selected");
					}

					this.engine.repaintCanvas();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_MOVE,
				fire: () => {
					if (!this.link) return;
					this.engine.repaintCanvas();
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.KEY_UP,
				fire: (actionEvent: ActionEvent<KeyboardEvent>) => {
					// on esc press remove any started link and pop back to default state
					if (actionEvent.event.keyCode === 27) {
						this.link?.remove();
						this.clearState();
						this.eject();
						this.engine.repaintCanvas();
					}
				}
			})
		);
	}

	clearState() {
		if (this.sourcePort) {
			this.sourcePort.fireEvent({}, "link-unselected");
			this.sourcePort.removeLink(this.link);
		}
		this.link = undefined;
		this.sourcePort = undefined;
	}
}
