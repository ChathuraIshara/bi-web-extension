/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Mapping } from "@wso2-enterprise/ballerina-core";
import { BaseVisitor } from "./BaseVisitor";

export class MappingDeletionVisitor implements BaseVisitor {
    private currentMappings: Mapping[] = [];
    private mappingStack: Mapping[][] = [];
    private isWithinFieldToBeDeleted: boolean = false;

    constructor(
        private targetIdToDelete: string
    ){}

    beginVisitMapping(node: Mapping): void {
        if (node.elements && node.elements.length > 0) {
            // Push current mappings to stack before processing nested elements
            this.mappingStack.push(this.currentMappings);
            this.currentMappings = [];
            
            if (node.output.startsWith(this.targetIdToDelete)) {
                this.isWithinFieldToBeDeleted = true;
            } else {
                // Create a copy of the node without elements
                const nodeCopy: Mapping = { ...node, elements: [] };
                this.mappingStack[this.mappingStack.length - 1].push(nodeCopy);
            }
        } else if (!node.output.startsWith(this.targetIdToDelete) && !this.isWithinFieldToBeDeleted) {
            this.currentMappings.push(node);
        }
    }

    endVisitMapping(node: Mapping): void {
        if (node.elements && node.elements.length > 0) {
            if (!this.isWithinFieldToBeDeleted) {
                // Add the processed elements back to the parent node
                const parentMappings = this.mappingStack[this.mappingStack.length - 1];
                const lastParentMapping = parentMappings[parentMappings.length - 1];
                if (this.currentMappings.length > 0) {
                    lastParentMapping.elements = [{ mappings: this.currentMappings }];
                }
            }
            
            // Restore the parent mappings
            this.currentMappings = this.mappingStack.pop() || [];
            
            if (node.output.startsWith(this.targetIdToDelete)) {
                this.isWithinFieldToBeDeleted = false;
            }
        }
    }

    getRemainingMappings(): Mapping[] {
        return this.currentMappings;
    }
}
