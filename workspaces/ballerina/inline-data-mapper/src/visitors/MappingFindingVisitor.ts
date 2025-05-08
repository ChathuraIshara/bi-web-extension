/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Mapping } from "@wso2-enterprise/ballerina-core";
import { BaseVisitor } from "./BaseVisitor";

export class MappingFindingVisitor implements BaseVisitor {
    private targetMapping: Mapping;

    constructor(
        private targetId: string
    ){}

    beginVisitMapping(node: Mapping): void {
        if (node.output === this.targetId) {
            this.targetMapping = node;
        }
    }

    getTargetMapping(): Mapping {
        return this.targetMapping;
    }
}
