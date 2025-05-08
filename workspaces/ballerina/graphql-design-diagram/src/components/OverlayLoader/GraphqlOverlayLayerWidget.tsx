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

import { Container } from "../Canvas/CanvasWidgetContainer";

import { GraphqlOverlayLayerModel } from './GraphqlOverlayLayerModel';

export interface NodeLayerWidgetProps {
    layer: GraphqlOverlayLayerModel;
    engine: DiagramEngine;
}

export class GraphqlOverlayLayerWidget extends React.Component<NodeLayerWidgetProps> {
    render() {
        return (
            <Container className="dotted-background">
                <p>Rendering the Diagram...</p>
            </Container>
        );
    }
}
