/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IDMModel, IOType, Mapping } from "@wso2-enterprise/ballerina-core";
import { BaseVisitor } from "../visitors/BaseVisitor";

export function traverseNode(model: IDMModel, visitor: BaseVisitor) {
    visitor.beginVisit?.(model);

    // Visit input types
    if (model.inputs.length > 0) {
        for (const inputType of model.inputs) {
            traverseIOType(inputType, model, visitor);
        }
    }

    // Visit output type
    traverseIOType(model.output, model, visitor);

    // Visit mappings
    traverseMappings(model.mappings, undefined, model, visitor);

    visitor.endVisit?.(model);
}

function traverseIOType(ioType: IOType, parent: IDMModel, visitor: BaseVisitor) {
    if (!!ioType.category) {
        visitor.beginVisitInputType?.(ioType, parent);
        visitor.endVisitInputType?.(ioType, parent);
    } else {
        visitor.beginVisitOutputType?.(ioType, parent);
        visitor.endVisitOutputType?.(ioType, parent);
    }
}

function traverseMappings(mappings: Mapping[], parentMapping: Mapping, parentModel: IDMModel, visitor: BaseVisitor) {
    for (const mapping of mappings) {
        visitor.beginVisitMapping?.(mapping, parentMapping, parentModel);

        if (mapping?.elements.length > 0) {
            const mappingElelements = mapping.elements;

            for (const element of mappingElelements) {
                traverseMappings(element.mappings, mapping, parentModel, visitor);
            }
        }

        visitor.endVisitMapping?.(mapping, parentMapping, parentModel);
    }
}
