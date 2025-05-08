/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NodeType } from "../../NodeFilter";
import { GraphqlDesignModel } from "../../resources/model";
import { OperationTypes } from "../../TypeFilter";

import {
    createFilteredNodeModel,
    generateDiagramNodesForFilteredNodes, generateLinksForFilteredNodes, generateLinksForSupportingNodes,
    getRelatedNodes, graphqlServiceModelMapper, updatedGraphqlModel
} from "./serviceModelGenerator";

export function diagramGeneratorForNodeFiltering(graphqlModel: GraphqlDesignModel, filteredNode: NodeType) {
    const selectedNodeInteractions = getRelatedNodes(graphqlModel, [filteredNode.name]);
    let updatedModel: GraphqlDesignModel = { ...graphqlModel };
    updatedModel.graphqlService = null;
    updatedModel = createFilteredNodeModel(selectedNodeInteractions, graphqlModel, updatedModel)
    const updatedNodes = generateDiagramNodesForFilteredNodes(updatedModel);
    generateLinksForSupportingNodes(updatedNodes);
}

export function diagramGeneratorForOperationTypeFiltering(graphqlModel: GraphqlDesignModel, typeFilter: OperationTypes) {
    let updatedModel: GraphqlDesignModel = updatedGraphqlModel(graphqlModel, typeFilter);
    // generate the graphql service node for filtered model
    graphqlServiceModelMapper(updatedModel.graphqlService);
    updatedModel = generateDiagramNodesForFilteredNodes(updatedModel);
    generateLinksForFilteredNodes(updatedModel);
}
