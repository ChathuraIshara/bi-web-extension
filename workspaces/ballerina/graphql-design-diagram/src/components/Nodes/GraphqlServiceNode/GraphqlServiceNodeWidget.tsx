/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda sx-wrap-multiline
import React from "react";

import { DiagramEngine } from "@projectstorm/react-diagrams";

import { NodeContainer } from "../../resources/styles/styles";

import { FunctionCard } from "./FunctionCards/FunctionCard";
import { GraphqlServiceNodeModel } from "./GraphqlServiceNodeModel";
import { ServiceHeadWidget } from "./ServiceHead/ServiceHead";

interface ServiceNodeWidgetProps {
    node: GraphqlServiceNodeModel;
    engine: DiagramEngine;
}

export function GraphqlServiceNodeWidget(props: ServiceNodeWidgetProps) {
    const { node, engine } = props;

    return (
        <NodeContainer data-testid={`graphql-root-node-${node.serviceObject.serviceName ? node.serviceObject.serviceName : "/root"}`}>
            <ServiceHeadWidget
                engine={engine}
                node={node}
            />
            {
                node.serviceObject.resourceFunctions?.map((resource, index) => {
                    return (
                        <FunctionCard
                            key={index}
                            engine={engine}
                            node={node}
                            functionElement={resource}
                            isResourceFunction={true}
                            isSubscription={resource.subscription}
                        />
                    );
                })
            }
            {
                node.serviceObject.remoteFunctions?.map((remoteFunc, index) => {
                    return (
                        <FunctionCard
                            key={index}
                            engine={engine}
                            node={node}
                            functionElement={remoteFunc}
                            isResourceFunction={false}
                        />
                    );
                })
            }
        </NodeContainer>
    );
}
