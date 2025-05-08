/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MediaType as M } from "../../../Definitions/ServiceDefinitions";
import { MediaType } from "./MediaType";
import { ReadOnlyMediaType } from "./ReadOnlyMediaType";

export default {
    component: MediaType,
    title: 'New MediaType',
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


export const MedaiTypeStory = () => {
    return (
        <MediaType mediaType={MediaT} onMediaTypeChange={(mediaType: M) => {console.log(mediaType)}} />
    );
};

export const ReadOnlyMediaTypeStory = () => {
    return (
        <ReadOnlyMediaType mediaType={MediaT} />
    );
}
