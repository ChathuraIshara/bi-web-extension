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
import { ApiDesigner } from "./ApiDesigner";

export default {
    component: ApiDesigner,
    title: 'New API Designer',
};

const apiDef: OpenAPI = petstoreJSON as unknown as OpenAPI;

export const ApiDesignerStory = () => {
    const [apiDefinition, setApiDefinition] = useState<OpenAPI>(apiDef);
    return (
        <ApiDesigner
            openApi={apiDefinition}
            isEditMode={false}
            openAPIVersion="3.0.1"
            onOpenApiChange={(openApi: OpenAPI) => {
                console.log("API Designer Change", openApi);
                setApiDefinition({ ...openApi });
            }}
        />
    );
}
