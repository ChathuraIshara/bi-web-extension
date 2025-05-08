/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { ReferenceObject, RequestBody } from "../../../Definitions/ServiceDefinitions";
import { RefRequestBody } from "./RefRequestBody";

export default {
    component: RefRequestBody,
    title: 'New Ref Request Body',
};

const r: RequestBody = {
    description: "Test",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    age: {
                        type: "number"
                    }
                }
            }
        }
    }
};

export const RefRequestBodyStory = () => {
    const [requestBody, setRequestBody] = useState<RequestBody | ReferenceObject>(r);
    const [name, setName] = useState<string>("Test");
    const onParameterChange = (requestBody: RequestBody | ReferenceObject, name: string) => {
        setRequestBody(requestBody);
        setName(name);
    }
    return (
        <RefRequestBody
            requestBodyName={name}
            requestBody={requestBody}
            onRequestBodyChange={onParameterChange}
        />
    );
};
