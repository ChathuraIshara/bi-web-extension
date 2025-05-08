/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Operation as O, Parameter, ReferenceObject, RequestBody, Responses } from "../../../Definitions/ServiceDefinitions";
import { Operation } from "./Operation";
import { ReadOnlyOperation } from "./ReadOnlyOperation";

export default {
    component: Operation,
    title: 'New Operation',
};

const Parameters: Parameter[] = [
    {
        name: "name",
        in: "query",
        description: "description",
        required: true,
        schema: {
            type: "string",
        },
    },
];

const requestBody: RequestBody = {
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
        "application/xml": {
            schema: {
                type: "object",
                required: ["type"],
                properties: {
                    type: {
                        type: "string",
                    },
                },
            },
        },
    },
};

const responses: Responses = {
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
            "application/xml": {
                schema: {
                    type: "object",
                    required: ["type"],
                    properties: {
                        type: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
    "400": {
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
                    },
                },
            },
        },
    },
};

const operation: O = {
    summary: "summary",
    description: "description",
    operationId: "operationId",
    parameters: Parameters,
    requestBody: requestBody,
    responses: responses,
};

export const OperationStory = () => {
    const [op, setOp] = useState<O>(operation);
    const handleOperationChange = (operation: O) => {
        setOp(operation);
        console.log(operation);
    };
    return (
        <Operation 
            operation={op} 
            onOperationChange={handleOperationChange}
            method="post"
            path="/path"
        />
    );
};

export const ReadOnlyOperationStory = () => {
    return (
        <ReadOnlyOperation
            operation={operation}
            method="post"
            path="/path"
        />
    );
}
