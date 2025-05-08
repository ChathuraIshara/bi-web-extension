/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import ResourceAccordion from "./ResourceAccordion";
import { PARAM_TYPES, Resource } from "../../definitions";
import { Typography } from "@wso2-enterprise/ui-toolkit";

export default {
    component: ResourceAccordion,
    title: 'Resource Accordion',
};

const handleResourceDelete = (resource: Resource) => {
    console.log("Delete resource ", resource);
};
const handleResourceEdit = (resource: Resource) => {
    console.log("Edit resource ", resource);
};
const handleGoToSource = (resource: Resource) => {
    console.log("Go to source postion ", resource);
};

const resource: Resource = {
    methods: ["GET"],
    path: "foo",
    pathSegments: [
        {
            id: 0,
            name: "path",
            type: "string",
            option: PARAM_TYPES.HEADER,
            isRequired: true
        },
        {
            id: 1,
            name: "path",
            type: "string",
            option: PARAM_TYPES.DEFAULT,
            isRequired: true
        }
    ],
    advancedParams: new Map<string, any>([
        [PARAM_TYPES.REQUEST, {
            id: 0,
            name: "param1",
            type: "string",
            option: PARAM_TYPES.HEADER,
            isRequired: true
        }],
        [PARAM_TYPES.CALLER, {
            id: 1,
            name: "param2",
            type: "string",
            option: PARAM_TYPES.DEFAULT,
            isRequired: true
        }]
    ]),
    params: [
        {
            id: 0,
            name: "param3",
            type: "string",
            option: PARAM_TYPES.HEADER,
            isRequired: true
        },
        {
            id: 1,
            name: "param4",
            type: "string",
            option: PARAM_TYPES.DEFAULT,
            isRequired: true
        }
    ],
    payloadConfig: {
        id: 0,
        name: "payload",
        type: "string",
        option: PARAM_TYPES.PAYLOAD,
        isRequired: true
    },
    responses: [
        {
            id: 0,
            code: 200,
            type: "string"
        },
        {
            id: 1,
            code: 500,
            type: "int"
        }
    ],
    updatePosition: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    addtionalInfo: (
        <Typography variant="h3">Add additional information here...</Typography>
    )
};

export const ResourceAccordionStory = () => {
    return (
        <ResourceAccordion
            goToSource={handleGoToSource}
            onEditResource={handleResourceEdit}
            onDeleteResource={handleResourceDelete}
            resource={resource}
        />
    );
};
