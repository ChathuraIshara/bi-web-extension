/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { ProgressRing, ThemeColors } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';

import { OverlayLayerModel } from './OverlayLayerModel';

export interface NodeLayerWidgetProps {
	layer: OverlayLayerModel;
	engine: DiagramEngine;
}

const Container = styled.div`
	align-items: center;
	background-image: radial-gradient(circle at 0.5px 0.5px, var(--vscode-textBlockQuote-border) 1px, transparent 0);
	display: flex;
	flex-direction: row;
	height: 100%;
	justify-content: center;
	width: 100%;
`;

export class OverlayLayerWidget extends React.Component<NodeLayerWidgetProps> {
	render() {
		return (
			<Container>
				<ProgressRing sx={{ color: ThemeColors.PRIMARY }} />
			</Container>
		);
	}
}
