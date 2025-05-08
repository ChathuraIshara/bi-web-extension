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
import { Info } from "./Info";
import { ReadOnlyInfo } from "./ReadOnlyInfo";

export default {
    component: Info,
    title: 'New Info',
};

const apiDefinition: OpenAPI = petstoreJSON as unknown as OpenAPI;

export const InfoStory = () => {
    const [info, setInfo] = useState(apiDefinition.info);

    return (
        <Info
            info={info}
            onInfoChange={(newInfo) => {
                setInfo(newInfo);
                console.log(newInfo);
            }}
            selectedOptions={["Summary", "Description"]}
            isNewFile
        />
    );
};

export const ReadOnlyInfoStory = () => {
    return (
        <ReadOnlyInfo info={apiDefinition.info} />
    );
}
