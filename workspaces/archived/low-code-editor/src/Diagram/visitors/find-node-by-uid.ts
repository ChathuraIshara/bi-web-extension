/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    ClassDefinition,
    ConstDeclaration,
    FunctionDefinition,
    ModuleVarDecl,
    ObjectMethodDefinition,
    ResourceAccessorDefinition,
    ServiceDeclaration,
    STKindChecker,
    STNode,
    TypeDefinition,
    Visitor
} from "@wso2-enterprise/syntax-tree";

import { generateConstructIdStub, MODULE_DELIMETER } from "./util";

export class FindNodeByUidVisitor implements Visitor {
    private uid: string;
    private stack: string[];
    private moduleServiceIndex: number;
    private moduleFunctionIndex: number;
    private moduleClassIndex: number;
    private moduleTypeIndex: number;
    private classMemberIndex: number;
    private constantIndex: number;
    private moduleVarIndex: number;
    private selectedNode: STNode;

    constructor(uid: string) {
        this.uid = uid;
        this.stack = [];
        this.moduleFunctionIndex = 0;
        this.moduleServiceIndex = 0;
        this.moduleClassIndex = 0;
        this.moduleTypeIndex = 0;
        this.classMemberIndex = 0;
        this.constantIndex = 0;
        this.moduleVarIndex = 0;
    }

    beginVisitClassDefinition(node: ClassDefinition, parent?: STNode): void {
        this.moduleClassIndex++;
        this.classMemberIndex = 0;
        this.stack.push(generateConstructIdStub(node, this.moduleClassIndex));
        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitClassDefinition(node: ClassDefinition, parent?: STNode): void {
        this.stack.pop();
    }

    beginVisitServiceDeclaration(node: ServiceDeclaration, parent?: STNode): void {
        this.classMemberIndex = 0;
        this.moduleServiceIndex++;
        this.stack.push(generateConstructIdStub(node, this.moduleServiceIndex));
        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitServiceDeclaration(node: ServiceDeclaration, parent?: STNode): void {
        this.stack.pop();
    }

    beginVisitFunctionDefinition(node: FunctionDefinition, parent?: STNode): void {
        if (parent && STKindChecker.isModulePart(parent)) {
            this.moduleFunctionIndex++;
            this.stack.push(generateConstructIdStub(node, this.moduleFunctionIndex));
        } else {
            this.classMemberIndex++;
            this.stack.push(generateConstructIdStub(node, this.classMemberIndex));
        }

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitFunctionDefinition(node: FunctionDefinition, parent?: STNode): void {
        this.stack.pop();
    }

    beginVisitResourceAccessorDefinition(node: ResourceAccessorDefinition, parent?: STNode): void {
        this.classMemberIndex++;
        this.stack.push(generateConstructIdStub(node, this.classMemberIndex));

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitResourceAccessorDefinition(node: ResourceAccessorDefinition, parent?: STNode): void {
        this.stack.pop();
    }

    beginVisitObjectMethodDefinition(node: ObjectMethodDefinition, parent?: STNode) {
        this.classMemberIndex++;
        this.stack.push(generateConstructIdStub(node, this.classMemberIndex));

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitObjectMethodDefinition(node: ObjectMethodDefinition, parent?: STNode) {
        this.stack.pop();
    }

    beginVisitTypeDefinition(node: TypeDefinition, parent?: STNode): void {
        this.moduleTypeIndex++;
        this.stack.push(generateConstructIdStub(node, this.moduleTypeIndex));

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitTypeDefinition(node: TypeDefinition, parent?: STNode): void {
        this.stack.pop();
    }

    beginVisitModuleVarDecl(node: ModuleVarDecl) {
        this.moduleVarIndex++;
        this.stack.push(generateConstructIdStub(node, this.moduleVarIndex));

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitModuleVarDecl(node: ModuleVarDecl) {
        this.stack.pop();
    }

    beginVisitConstDeclaration(node: ConstDeclaration) {
        this.constantIndex++;
        this.stack.push(generateConstructIdStub(node, this.constantIndex));

        if (this.getCurrentUid() === this.uid) {
            this.selectedNode = node;
        }
    }

    endVisitConstDeclaration(node: ConstDeclaration) {
        this.stack.pop();
    }

    private getCurrentUid(): string {
        return this.stack.reduce((prev, current) =>
            prev.length === 0 ? current : `${prev}${MODULE_DELIMETER}${current}`, '');
    }

    public getNode(): STNode {
        return this.selectedNode;
    }
}
