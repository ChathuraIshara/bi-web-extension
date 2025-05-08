/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Branch, FlowNode } from "./types";

export function getNodeIdFromModel(node: FlowNode, prefix?: string) {
    if (!node) {
        return null;
    }
    if (prefix) {
        return `${prefix}-${node.id}`;
    }
    return node.id;
}

export function getBranchLabel(branch: Branch): string {
    return branch.properties?.condition?.value?.toString().trim() || branch.label;
}

export function getCustomNodeId(nodeId: string, label: string, branchIndex?: number, suffix?: string) {
    return `${nodeId}-${label}${branchIndex ? `-${branchIndex}` : ""}${suffix ? `-${suffix}` : ""}`;
}

export function reverseCustomNodeId(customNodeId: string) {
    const parts = customNodeId.split("-");
    const nodeId = parts[0];
    const label = parts[1];
    const branchIndex = parts.length > 3 ? parseInt(parts[3]) : undefined;
    const suffix = parts.length > 4 ? parts.slice(4).join("-") : undefined;
    return { nodeId, label, branchIndex, suffix };
}

export function getBranchInLinkId(nodeId: string, branchLabel: string, branchIndex: number) {
    return `${nodeId}-${branchLabel}-branch-${branchIndex}-in-link`;
}

export function nodeHasError(node: FlowNode) {
    if (!node) {
        return false;
    }

    // Check node
    if (node.diagnostics && node.diagnostics.hasDiagnostics && node.diagnostics.diagnostics) {
        return node.diagnostics.diagnostics?.some((diagnostic) => diagnostic.severity === "ERROR");
    }

    // Check branch properties
    if (node.branches) {
        return node.branches.some((branch) => {
            if (!branch.properties) {
                return false;
            }
            return Object.values(branch.properties).some((property) =>
                property?.diagnostics?.diagnostics?.some((diagnostic) => diagnostic.severity === "ERROR")
            );
        });
    }

    // Check properties
    if (node.properties) {
        const hasPropertyError = Object.values(node.properties).some((property) =>
            property?.diagnostics?.diagnostics?.some((diagnostic) => diagnostic.severity === "ERROR")
        );
        if (hasPropertyError) {
            return true;
        }
    }

    return false;
}

export function getNodeTitle(node: FlowNode) {
    const label = node.metadata.label.includes(".") ? node.metadata.label.split(".").pop() : node.metadata.label;

    if (node.codedata?.org === "ballerina" || node.codedata?.org === "ballerinax") {
        const module = node.codedata.module.includes(".")
            ? node.codedata.module.split(".").pop()
            : node.codedata.module;
        return `${module} : ${label}`;
    }
    return label;
}

export function getRawTemplate(text: string) {
    const rawTemplateRegex = /^`.+$`/
    const isRawTemplate = text.match(rawTemplateRegex)?.[0];
    if (!isRawTemplate) {
        return `\`${text}\``;
    }

    return text;
}
