/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React from "react";

import { AutoComplete } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../DiagramContext/GraphqlDiagramContext";

export enum NodeCategory {
    GRAPHQL_SERVICE = "graphqlService",
    RECORD = "record",
    SERVICE_CLASS = "serviceClass",
    INTERFACE = "interface",
    UNION = "union",
    ENUM = "enum"
}

export interface NodeType {
    name: string;
    type: NodeCategory;
}

interface NodeFilterProps {
    nodeList: NodeType[];
}

export function NodeFilter(props: NodeFilterProps) {
    const { nodeList } = props;
    const { setFilteredNode, filteredNode } = useGraphQlContext();

    const updateNode = (newValue: string) => {
        // find the NodeType matching the newValue
        const node = nodeList.find((item) => item.name === newValue);
        if (node) {
            setFilteredNode(node);
        }
    }

    return (
        <>
            {
                nodeList && (
                    <AutoComplete
                        data-testid="node-filter-autocomplete"
                        id="node-filter-select"
                        items={nodeList.map(
                            item => item?.name
                        )}
                        value={filteredNode ? filteredNode.name : nodeList[0]?.name}
                        onValueChange={(newValue: string) => updateNode(newValue)}
                        label={'Type'}
                        borderBox={true}
                        sx={{
                            width: "180px"
                        }}
                    />
                )
            }
        </>
    );
}
