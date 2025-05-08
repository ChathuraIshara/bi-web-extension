/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Response as R } from "../../../Definitions/ServiceDefinitions";
import { Response } from "./Response";
import { ReadOnlyResponse } from "./ReadOnlyResponse";

export default {
    component: Response,
    title: 'New Response',
};


const response: R = {
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
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                    },
                },
            },
        },
    },
};

export const ResponsesStory = () => {
    const [r, setR] = useState<R>(response);
    const handleResponseChange = (response: R) => {
        setR(response);
    }
    return (
        <Response response={r} onResponseChange={handleResponseChange} />
    );
};

export const ReadOnlyResponsesStory = () => {
    return (
        <ReadOnlyResponse response={response} />
    );
}
