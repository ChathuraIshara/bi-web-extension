/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { useState } from "react";
import { OpenAPI } from "../../../Definitions/ServiceDefinitions";
import petstoreJSON from "../../Data/petstoreJSON.json";
import { Overview } from "./Overview";
import { ReadOnlyOverview } from "./ReadOnlyOverview";

export default {
    component: Overview,
    title: 'New Overview',
};

const apiDefinition: OpenAPI = petstoreJSON as unknown as OpenAPI;

export const OverviewStory = () => {
    const [apiDefinition, setApiDefinition] = useState<OpenAPI>(petstoreJSON as unknown as OpenAPI);
    const handleOpenApiDefinitionChange = (openAPIDefinition: OpenAPI) => {
        console.log("change", openAPIDefinition);
        setApiDefinition(openAPIDefinition);
    }
    return (
        <Overview
            openAPIDefinition={apiDefinition}
            onOpenApiDefinitionChange={handleOpenApiDefinitionChange}
            isNewFile={false}
        />
    );
};

export const ReadOnlyOverviewStory = () => {
    return (
        <ReadOnlyOverview openAPIDefinition={apiDefinition} />
    );
}
