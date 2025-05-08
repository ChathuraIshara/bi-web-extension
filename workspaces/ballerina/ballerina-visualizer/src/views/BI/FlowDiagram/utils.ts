/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Category, AvailableNode, BallerinaProjectComponents } from "@wso2-enterprise/ballerina-core";
import { URI, Utils } from "vscode-uri";

// Filter out connections where name starts with _ and module is "ai" or "ai.agent"
export const filterConnections = (categories: Category[]): Category[] => {
    return categories.map((category) => {
        if (category.metadata.label === "Connections") {
            const filteredItems = category.items.filter((item) => {
                if ("metadata" in item && "items" in item && item.items.length > 0 && "codedata" in item.items.at(0)) {
                    const name = item.metadata.label || "";
                    const module = (item.items.at(0) as AvailableNode)?.codedata.module || "";

                    // Filter out items where name starts with _ and module is "ai" or "ai.agent"
                    return !(name.startsWith("_") && (module === "ai" || module === "ai.agent"));
                }
                return true;
            });

            return {
                ...category,
                items: filteredItems,
            };
        }
        return category;
    });
};

export const transformCategories = (categories: Category[]): Category[] => {
    // First filter connections
    let filteredCategories = filterConnections(categories);

    // filter out some categories that are not supported in the diagram
    // TODO: these categories should be supported in the future
    const notSupportedCategories = [
        "PARALLEL_FLOW",
        "LOCK",
        "START",
        "TRANSACTION",
        "COMMIT",
        "ROLLBACK",
        "RETRY"
    ];

    filteredCategories = filteredCategories.map((category) => ({
        ...category,
        items: category?.items?.filter(
            (item) => !("codedata" in item) || !notSupportedCategories.includes((item as AvailableNode).codedata?.node)
        ),
    })) as Category[];

    // remove agents from categories
    filteredCategories = filteredCategories.filter((category) => category.metadata.label !== "Agents");

    // find statement category
    const statementCategory = filteredCategories.find((category) => category.metadata.label === "Statement");
    // find AGENT_CALL from statement category
    const agentCallNode = statementCategory?.items?.find(
        (item) => (item as AvailableNode).codedata?.node === "AGENT_CALL"
    ) as AvailableNode;
    if (agentCallNode?.codedata) {
        // HACK: update agent call node until LS update with the new agent node
        agentCallNode.codedata.object = "Agent";
        agentCallNode.codedata.parentSymbol = "";
    } else {
        // TODO: this should remove once LS update with the new agent node
        // add new item
        statementCategory.items.push({
            codedata: {
                module: "ai",
                node: "AGENT_CALL",
                object: "Agent",
                org: "ballerinax",
                parentSymbol: "",
                symbol: "run",
                version: "1.0.0",
            },
            enabled: true,
            metadata: {
                label: "Agent",
                description: "Add an AI Agent to the flow",
            },
        });
    }

    return filteredCategories;
};

export const findFunctionByName = (components: BallerinaProjectComponents, functionName: string) => {
    for (const pkg of components.packages) {
        for (const module of pkg.modules) {
            const foundFunction = module.functions.find((func: any) => func.name === functionName);
            if (foundFunction) {
                const pkgUri = URI.parse(pkg.filePath);
                const joinedUri = Utils.joinPath(pkgUri, foundFunction.filePath);
                foundFunction.filePath = joinedUri.fsPath;
                return foundFunction;
            }
        }
    }
    return null;
};
