/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import styled from "@emotion/styled";

import { OverlayLayerModel } from "./OverlayLayerModel";
import { ProgressRing } from "@wso2-enterprise/ui-toolkit";
import { DiagramStyles } from "../DiagramCanvas";
import { Colors } from "../../resources/constants";

export interface NodeLayerWidgetProps {
    layer: OverlayLayerModel;
    engine: DiagramEngine;
}

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: center;
    width: 100%;
    background-color: ${Colors.SURFACE_BRIGHT};
    z-index: 1000;
`;

export class OverlayLayerWidget extends React.Component<NodeLayerWidgetProps> {
    render() {
        return (
            <DiagramStyles.Container background={Colors.SURFACE_BRIGHT} color={Colors.ON_SURFACE}>
                <Container>
                    <ProgressRing color={Colors.PRIMARY}/>
                </Container>
            </DiagramStyles.Container>
        );
    }
}
