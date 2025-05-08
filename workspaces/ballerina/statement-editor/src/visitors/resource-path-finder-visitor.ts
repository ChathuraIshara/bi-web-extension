/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import {
    ResourceAccessorDefinition,
    Visitor
} from "@wso2-enterprise/syntax-tree";

interface MethodPath {
    method: string;
    path: string;
}

export class ResourcePathFinderVisitor implements Visitor {

    matchingPaths: MethodPath[] = [];
    isEditing: boolean;
    new: MethodPath;
    current: MethodPath;
    validPath: boolean;

    constructor(isEditing: boolean, newMethodPath: MethodPath, currentMethodPath: MethodPath) {
        this.new = newMethodPath;
        this.current = currentMethodPath;
        this.matchingPaths = [];
        this.isEditing = isEditing;
        this.validPath = false;
    }

    public beginVisitResourceAccessorDefinition(node: ResourceAccessorDefinition) {
        const method = node.functionName.value.toUpperCase();
        const path = node.relativeResourcePath.length > 0 ? node.relativeResourcePath[0].value : "";

        if (this.isEditing) {
            if ((this.current.method !== method && this.current.path !== path) && (this.new.method === method && this.new.path === path)) {
                this.matchingPaths.push(this.new);
            }
        } else {
            if (this.new.method === method && this.new.path === path) {
                this.matchingPaths.push(this.new);
            }
        }

    }

    getResourcePathValidity(): boolean {
        return this.matchingPaths.length === 0;
    }
}
