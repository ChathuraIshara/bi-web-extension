/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { OpenAPI } from "../../../../Definitions/ServiceDefinitions";
import petstoreJSON from "../../../Data/petstoreJSON.json";
import { SchemaTreeView } from "./SchemaTreeView";

export default {
    component: SchemaTreeView,
    title: 'New Schema TreeView',
};

export const SchemaTreeViewStory = () => {
    const [apiDefinition, setApiDefinition] = useState<OpenAPI>(petstoreJSON as unknown as OpenAPI);
    return (
        <SchemaTreeView
            openAPI={apiDefinition}
            onSchemaTreeViewChange={(openAPI: OpenAPI) => {
                console.log("Schema TreeView Change", openAPI);
                setApiDefinition(openAPI);
            }}
        />
    );
};
