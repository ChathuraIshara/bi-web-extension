/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Headers as H } from "../../../Definitions/ServiceDefinitions";
import { Headers } from "./Headers";
import { ReadOnlyHeaders } from "./ReadOnlyHeaders";

export default {
    component: Headers,
    title: 'New Headers',
};

const HS: H = {
    "header1": {
        description: "header 1 description",
        required: true,
        schema: {
            type: "string",
        },
    },
    "header2": {
        description: "header 2 description",
        required: true,
        schema: {
            type: "string",
        },
    },
};

export const HeadersStory = () => {
    const [headers, setHeaders] = useState<H>(HS);
    const handleHeadersChange = (headers: H) => {
        console.log(headers);
        setHeaders(headers);
    }
    return (
        <Headers
            headers={headers}
            onHeadersChange={handleHeadersChange}
        />
    );
};

export const ReadOnlyHeadersStory = () => {
    return (
        <ReadOnlyHeaders
            headers={HS}
        />
    );
}
