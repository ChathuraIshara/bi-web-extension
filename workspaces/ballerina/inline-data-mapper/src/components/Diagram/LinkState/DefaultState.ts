/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { MouseEvent } from 'react';

import {
	Action,
	ActionEvent,
	DragCanvasState,
	InputType,
	SelectingState,
	State
} from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState, PortModel } from '@projectstorm/react-diagrams-core';

import { DMCanvasContainerID } from "../Canvas/DataMapperCanvasWidget";
import { ArrayOutputNode, InputNode, ObjectOutputNode } from '../Node';
import { DataMapperNodeModel } from "../Node/commons/DataMapperNode";
import { LinkOverayContainerID } from '../OverriddenLinkLayer/LinkOverlayPortal';
import { CreateLinkState } from './CreateLinkState';
import { useDMExpressionBarStore } from '../../../store/store';

export class DefaultState extends State<DiagramEngine> {
	dragCanvas: DragCanvasState;
	createLink: CreateLinkState;
	dragItems: DragDiagramItemsState;

	constructor(resetState: boolean = false) {
		super({ name: 'starting-state' });
		this.childStates = [new SelectingState()];
		this.dragCanvas = new DragCanvasState({allowDrag: false});
		this.createLink = new CreateLinkState(resetState);
		this.dragItems = new DragDiagramItemsState();

		// determine what was clicked on
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);
					const isExpandOrCollapse = (event.event.target as Element)
						.closest('div[id^="expand-or-collapse"]');

					// the canvas was clicked on, transition to the dragging canvas state
					if (!element) {
						const targetElement = event.event.target as Element;
						const dmCanvasContainer = targetElement.closest(`#${DMCanvasContainerID}`);
						const linkOverlayContainer = targetElement.closest(`#${LinkOverayContainerID}`);
						if (linkOverlayContainer) {
							// Clicked on a link overlay item or a diagnostic tooltip,
							// hence, do not propagate as a canvas drag
						} else if (dmCanvasContainer) {
							this.deselectLinks();
							this.transitionWithEvent(this.dragCanvas, event);
						}
					}
					// initiate dragging a new link
					else if ((element instanceof PortModel || element instanceof DataMapperNodeModel) && !isExpandOrCollapse) {
						return;
					}
					// move the items (and potentially link points)
					else {
						this.transitionWithEvent(this.dragItems, event);
					}
				}
			})
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (actionEvent: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);
					const isExpandOrCollapse = (actionEvent.event.target as Element)
						.closest('button[id^="expand-or-collapse"]');
					const isAddElement = (actionEvent.event.target as Element)
						.closest('button[id^="add-array-element"]');

					if (!isExpandOrCollapse && !isAddElement
						&& (element instanceof PortModel
							|| element instanceof ObjectOutputNode
							|| element instanceof ArrayOutputNode
							|| element instanceof InputNode
						)
					) {
						this.transitionWithEvent(this.createLink, actionEvent);
					}
				}
			})
		);


		this.registerAction(
			new Action({
				type: InputType.KEY_UP,
				fire: (actionEvent) => {
					// On esc press unselect any selected link
					if ((actionEvent.event as any).keyCode === 27) {
						this.deselectLinks();
					}
				}
			})
		);
	}

	deselectLinks() {
		this.engine.getModel().getLinks().forEach((link) => {
			link.setSelected(false);
			link.getSourcePort()?.fireEvent({}, "link-unselected");
			link.getTargetPort()?.fireEvent({}, "link-unselected");
		});
		useDMExpressionBarStore.getState().resetFocus();
	}
}
