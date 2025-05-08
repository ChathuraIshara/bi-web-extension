/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Visitor } from './base-visitor';
import { STNode } from './syntax-tree-interfaces';

const metaNodes = ['viewState', 'position', 'parent'];

export function traversNode(node: STNode, visitor: Visitor, parent?: STNode) {
    let name = ""
    node.tag.split('-').forEach((tag) => {
        name += tag.charAt(0).toUpperCase() + tag.slice(1);
    });

    if (name.includes(":")) {
        name = name.split(":")[1];
        name = name.charAt(0).toUpperCase() + name.substring(1);
    }

    if (name.includes(".")) {
        name = "Connector";
    }

    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitSTNode && visitor.beginVisitSTNode;
    }

    if (beginVisitFn) {
        beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    keys.forEach((key) => {
        if (metaNodes.includes(key) || visitor.skipChildren()) {
            return;
        }

        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                if (!elementNode?.tag) {
                    return;
                }

                traversNode(elementNode, visitor, node);
            });
            return;
        }

        if (!childNode.tag) {
            return;
        }

        traversNode(childNode, visitor, node);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitSTNode && visitor.endVisitSTNode;
    }

    if (endVisitFn) {
        endVisitFn.bind(visitor)(node, parent);
    }
}

export async function traversNodeAsync(node: STNode, visitor: Visitor, parent?: STNode) {
    let name = ""
    node.tag.split('-').forEach((tag) => {
        name += tag.charAt(0).toUpperCase() + tag.slice(1);
    });

    if (name.includes(":")) {
        name = name.split(":")[1];
        name = name.charAt(0).toUpperCase() + name.substring(1);
    }

    let beginVisitFn: any = (visitor as any)[`beginVisit${name}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitSTNode && visitor.beginVisitSTNode;
    }

    if (beginVisitFn) {
        await beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (metaNodes.includes(key)) {
            return;
        }

        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            for (let i = 0; i < childNode.length; i++) {
                const elementNode = childNode[i];
                if (!elementNode?.tag) {
                    return;
                }
                await traversNodeAsync(elementNode, visitor, node);

            }
            return;
        }
        if (!childNode.tag) {
            return;
        }
        await traversNodeAsync(childNode, visitor, node);
    }

    let endVisitFn: any = (visitor as any)[`endVisit${name}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitSTNode && visitor.endVisitSTNode;
    }

    if (endVisitFn) {
        await endVisitFn.bind(visitor)(node, parent);
    }
}
