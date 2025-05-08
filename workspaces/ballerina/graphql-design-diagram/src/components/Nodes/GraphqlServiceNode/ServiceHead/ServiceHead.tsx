/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-no-lambda
import React, { useEffect, useRef } from 'react';

import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';

import { CtrlClickHandler } from '../../../CtrlClickHandler';
import { GraphqlBasePortWidget } from "../../../Port/GraphqlBasePortWidget";
import { GraphQLIcon } from "../../../resources/assets/icons/GraphQL";
import { HeaderName, NodeHeader } from "../../../resources/styles/styles";
import { getFormattedPosition } from "../../../utils/common-util";
import { GraphqlServiceNodeModel } from "../GraphqlServiceNodeModel";

import { ServiceHeaderMenu } from "./ServiceHeaderMenu";

interface ServiceHeadProps {
    engine: DiagramEngine;
    node: GraphqlServiceNodeModel;
}

export function ServiceHeadWidget(props: ServiceHeadProps) {
    const { engine, node } = props;
    const headPorts = useRef<PortModel[]>([]);
    const displayName: string = node.serviceObject.serviceName ? node.serviceObject.serviceName : "/root";

    useEffect(() => {
        headPorts.current.push(node.getPortFromID(`left-${node.getID()}`));
        headPorts.current.push(node.getPortFromID(`right-${node.getID()}`));
    }, [node]);


    return (
        <CtrlClickHandler
            filePath={node.serviceObject?.position?.filePath}
            position={node.serviceObject?.position && getFormattedPosition(node.serviceObject.position)}
        >
            <NodeHeader data-testid={`graphql-root-head-${displayName}`}>
                <GraphQLIcon />
                <GraphqlBasePortWidget
                    port={node.getPort(`left-${node.getID()}`)}
                    engine={engine}
                />
                <HeaderName>{displayName}</HeaderName>
                {/* <ServiceHeaderMenu location={node.serviceObject.position} nodeName={displayName} /> */}
                <GraphqlBasePortWidget
                    port={node.getPort(`right-${node.getID()}`)}
                    engine={engine}
                />
                <GraphqlBasePortWidget
                    port={node.getPort(`top-${node.getID()}`)}
                    engine={engine}
                />
            </NodeHeader>
        </CtrlClickHandler>
    );
}
