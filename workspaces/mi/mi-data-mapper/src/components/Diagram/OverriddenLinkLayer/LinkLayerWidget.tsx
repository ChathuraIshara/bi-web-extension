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
import { LinkLayerWidgetProps } from '@projectstorm/react-diagrams';
import * as _ from 'lodash';

import { LinkOverayContainerID } from './LinkOverlayPortal';
import { OveriddenLinkWidget } from './LinkWidget';

export class OveriddenLinkLayerWidget extends React.Component<LinkLayerWidgetProps> {
	render() {
		return (
			<>
				{
					// only perform these actions when we have a diagram
					_.map(this.props.layer.getLinks(), (link) => {
						return <OveriddenLinkWidget key={link.getID()} link={link} diagramEngine={this.props.engine} />;
					})
				}
				<LinkOverlayContainer id={LinkOverayContainerID} />
			</>
		);
	}
}


const LinkOverlayContainer = styled.g`
	pointer-events: none;
	&:focus {
		outline: none;
	}
`;
