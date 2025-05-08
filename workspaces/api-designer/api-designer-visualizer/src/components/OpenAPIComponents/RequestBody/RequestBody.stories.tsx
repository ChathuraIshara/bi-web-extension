/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { MediaType as M, RequestBody as R, ReferenceObject } from "../../../Definitions/ServiceDefinitions";
import { RequestBody } from "./RequestBody";
import { ReadOnlyRequestBody } from "./ReadOnlyRequestBody";

export default {
    component: RequestBody,
    title: 'New RequestBody',
};

const MediaT: M = {
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
};
const RequestB: R = {
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
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                    },
                    age: {
                        type: "integer",
                        format: "int32",
                    },
                    city: {
                        type: "string",
                    },
                },
            },
        },
    },
};

export const RequestBodyStory = () => {
    const [r, setR] = useState<(R | ReferenceObject)>(RequestB);
    const handleRequestBodyChange = (requestBody: (R | ReferenceObject)) => {
        setR(requestBody);
    };
    return (
        <RequestBody requestBody={r} onRequestBodyChange={handleRequestBodyChange} />
    );
};

export const ReadOnlyRequestBodyStory = () => {
    return (
        <ReadOnlyRequestBody requestBody={RequestB} />
    );
}
