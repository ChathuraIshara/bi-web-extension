/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-implicit-dependencies
import * as React from 'react';

import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import * as _ from 'lodash';

import { OverlayLayerModel } from './OverlayLayerModel';
import { OverlayModel } from './OverlayModel/OverlayModel';
import { OverlayWidget } from './OverlayModel/OverlayWidget';

export interface NodeLayerWidgetProps {
	layer: OverlayLayerModel;
	engine: DiagramEngine;
}

export const OverlayContainerID = "data-mapper-overlay-container";

export class OverlayLayerWidget extends React.Component<NodeLayerWidgetProps> {
	render() {
		return (
			<Container id={OverlayContainerID}>
				{_.map(this.props.layer.getOverlayItems(), (node: OverlayModel) => {
					return <OverlayWidget key={node.getID()} diagramEngine={this.props.engine} node={node} />;
				})}
			</Container>
		);
	}
}

export const Container = styled.div``;
