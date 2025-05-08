/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Responses as R } from "../../../Definitions/ServiceDefinitions";
import { Responses } from "./Responses";
import { ReadOnlyResponses } from "./ReadOnlyResponses";

export default {
    component: Responses,
    title: 'New Responses',
};

const responses: R = {
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
                        }
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
};

export const ResponsesStory = () => {
    const [r, setR] = useState<R>(responses);
    const handleResponsesChange = (responses: R) => {
        console.log("Responses changed", responses);
        setR(responses);
    };
    return (
        <Responses responses={r} onResponsesChange={handleResponsesChange} />
    );
};

// Responses with reference object
const responsesWithReferenceObject: R = {
    "200": {
        $ref: "#/components/responses/Success",
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
                        }
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
};

export const ResponsesWithReferenceObjectStory = () => {
    const [r, setR] = useState<R>(responsesWithReferenceObject);
    const handleResponsesChange = (responses: R) => {
        console.log("Responses changed", responses);
        setR(responses);
    };
    return (
        <Responses responses={r} onResponsesChange={handleResponsesChange} />
    );
};

export const ReadOnlyResponsesStory = () => {
    return (
        <ReadOnlyResponses responses={responses} />
    );
}
