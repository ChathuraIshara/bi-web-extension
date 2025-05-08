/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Response } from "../../../Definitions/ServiceDefinitions";
import { RefResponse } from "./RefResponse";

export default {
    component: RefResponse,
    title: 'New Ref Request Body',
};

const r: Response = {
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


export const RefResponseStory = () => {
    const [response, setResponse] = useState<Response>(r);
    const [name, setName] = useState<string>("Test");
    const onParameterChange = (requestBody: Response, name: string) => {
        setResponse(requestBody);
        setName(name);
    }
    return (
        <RefResponse
            responseName={name}
            response={response}
            onResponseChange={onParameterChange}
        />
    );
};
