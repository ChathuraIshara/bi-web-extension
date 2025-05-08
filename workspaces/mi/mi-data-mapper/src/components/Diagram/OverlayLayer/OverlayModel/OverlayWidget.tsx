/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from 'react';

import styled from '@emotion/styled';
import { ListenerHandle, PeformanceWidget } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import ResizeObserver from 'resize-observer-polyfill';

import { OverlayModel } from './OverlayModel';

export interface OverlayProps {
	node: OverlayModel;
	children?: React.ReactElement | React.ReactElement[];
	diagramEngine: DiagramEngine;
}

export const Overlay = styled.div`
	position: absolute;
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Chrome/Safari/Opera */
	user-select: none;
	cursor: move;
	pointer-events: all;
`;


export class OverlayWidget extends React.Component<OverlayProps> {
	ob: ResizeObserver;
	ref: React.RefObject<HTMLDivElement>;
	listener: ListenerHandle;

	constructor(props: OverlayProps) {
		super(props);
		this.ref = React.createRef();
	}

	componentWillUnmount(): void {
		this.ob.disconnect();
		this.ob = null;

		this.listener?.deregister();
		this.listener = null;
	}

	componentDidUpdate(prevProps: Readonly<OverlayProps>): void {
		if (this.listener && this.props.node !== prevProps.node) {
			this.listener.deregister();
			this.installSelectionListener();
		}
	}

	installSelectionListener() {
		this.listener = this.props.node.registerListener({
			selectionChanged: () => {
				this.forceUpdate();
			}
		});
	}

	updateSize(width: number, height: number) {
		this.props.node.updateDimensions({ width, height });
	}

	componentDidMount(): void {
		this.ob = new ResizeObserver((entities) => {
			const bounds = entities[0].contentRect;
			this.updateSize(bounds.width, bounds.height);
		});

		const b = this.ref.current.getBoundingClientRect();
		this.updateSize(b.width, b.height);
		this.ob.observe(this.ref.current);
		this.installSelectionListener();
	}

	render() {
		return (
			<PeformanceWidget model={this.props.node} serialized={this.props.node.serialize()}>
				{() => {
					return (
						<Overlay
							className="node"
							ref={this.ref}
							data-nodeid={this.props.node.getID()}
							style={{
								top: this.props.node.getY(),
								left: this.props.node.getX()
							}}
						>
							{/* TODO: Generate From Factory */}
						</Overlay>
					);
				}}
			</PeformanceWidget>
		);
	}
}
