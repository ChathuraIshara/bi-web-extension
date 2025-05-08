/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { PathItem as P } from "../../../Definitions/ServiceDefinitions";
import { PathItem } from "./PathItem";
import { ReadOnlyPathItem } from "./ReadOnlyPathItem";

export default {
    component: PathItem,
    title: 'New PathItem',
};

const pathItem: P = {
    summary: "summary",
    description: "description",
    post: {
        summary: "summary",
        description: "description",
        operationId: "operationId",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["name"],
                        properties: {
                            name: {
                                type: "string",
                            },
                            age: {
                                type: "integer",
                                format: "int32",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "description",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name"],
                            properties: {
                                name: {
                                    type: "string",
                                },
                                age: {
                                    type: "integer",
                                    format: "int32",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    parameters: [
        {
            name: "name",
            in: "query",
            description: "description",
            required: true,
            schema: {
                type: "string",
            },
        },
        {
            name: "id",
            in: "path",
            description: "description",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
};

export const PathItemStory = () => {
    const [pi, setPI] = useState<P>(pathItem);
    const [path, setPath] = useState<string>("/path");
    const handlePathItemChange = (pathItem: P, path: string) => {
        setPath(path);
        setPI(pathItem);
    }
    return (
        <PathItem pathItem={pi} path={path} onPathItemChange={handlePathItemChange} />
    );
};

export const ReadOnlyPathItemStory = () => {
    return (
        <ReadOnlyPathItem pathItem={pathItem} path="/path" />
    );
}
