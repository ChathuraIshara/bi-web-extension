/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { DataMapperNodeModel } from "../Node/commons/DataMapperNode";
import { InputNode } from "../Node";

export function findInputNode(field: string, outputNode: DataMapperNodeModel): InputNode {
    const nodes = outputNode.getModel().getNodes();

    const inputNode = nodes.find(node => {
        if (node instanceof InputNode) {
            const mappingStartsWith = field.split('.')[0];
            return node.inputType.id === mappingStartsWith;

        }
    });

    return inputNode ? inputNode as InputNode : undefined;
}
