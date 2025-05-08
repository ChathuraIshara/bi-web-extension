/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { OpenAPI as O } from "../../../Definitions/ServiceDefinitions";
import { OpenAPI } from "./OpenAPI";
import petstoreJSON from "../../Data/petstoreJSON.json";

export default {
    component: OpenAPI,
    title: 'New OpenAPI',
};

const openAPI: O = petstoreJSON as unknown as O;

export const PathStory = () => {
    const [o, setO] = useState<O>(openAPI);
    const handlePathItemChange = (openAPI: O) => {
        console.log("OpenAPI changed", openAPI);
        setO(openAPI);
    }
    return (
        <OpenAPI openAPI={o} onOpenAPIChange={handlePathItemChange} />
    );
};

export const PathMethodStory = () => {
    const [o, setO] = useState<O>(openAPI);
    const handlePathItemChange = (openAPI: O) => {
        console.log("OpenAPI changed", openAPI);
        setO(openAPI);
    }
    return (
        <OpenAPI openAPI={o} onOpenAPIChange={handlePathItemChange} />
    );
};

export const OverviewStory = () => {
    const [o, setO] = useState<O>(openAPI);
    const handlePathItemChange = (openAPI: O) => {
        console.log("OpenAPI changed", openAPI);
        setO(openAPI);
    }
    return (
        <OpenAPI openAPI={o} onOpenAPIChange={handlePathItemChange} />
    );
}

export const SchemaStory = () => {
    const [o, setO] = useState<O>(openAPI);
    const handlePathItemChange = (openAPI: O) => {
        console.log("OpenAPI changed", openAPI);
        setO(openAPI);
    }
    return (
        <OpenAPI openAPI={o} onOpenAPIChange={handlePathItemChange} />
    );
}
