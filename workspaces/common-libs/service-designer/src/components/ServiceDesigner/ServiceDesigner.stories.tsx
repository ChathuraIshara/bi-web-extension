/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { ServiceDesigner } from "./ServiceDesigner";
import { PARAM_TYPES, Resource, Service } from "../../definitions";

const GET: Resource = {
    methods: ["GET", "POST", "DELETE", "PATCH"],
    path: "pathGet",
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
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    }
};

// Generate a similar PUT as above
const putResource: Resource = {
    methods: ["PUT"],
    path: "pathPut",
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
    updatePosition: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    }
}

// Create a simalar POST resource
const postResource: Resource = {
    methods: ["POST"],
    path: "pathPost",
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
    updatePosition: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    }
}

// Create a simalar DELETE resource
const deleteResource: Resource = {
    methods: ["DELETE"],
    path: "pathDelete",
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
    updatePosition: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    }
}

// Create a simalar PATCH resource
const patchResource: Resource = {
    methods: ["PATCH"],
    path: "pathPatch",
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
    updatePosition: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    }
}

export default {
    component: ServiceDesigner,
    title: 'Service Designer',
};

const handleResourceAdd = () => {
    console.log("Add resource");
};
const handleResourceDelete = (resource: Resource) => {
    console.log("Delete resource ", resource);
};
const handleResourceEdit = (resource: Resource) => {
    console.log("Edit resource ", resource);
};
const handleGoToSource = (resource: Resource,) => {
    console.log("Go to source postion ", resource);
};
const handleServiceEdit = (service: Service) => {
    console.log("Edit service ", service);
};
const handleResourceImplement = (resource: Resource) => {
    console.log("Implement resource ", resource);
};

const serviceModel: Service = {
    path: "foo",
    port: 9090,
    position: {
        startColumn: 0,
        startLine: 0,
        endColumn: 0,
        endLine: 0
    },
    resources: [
        GET, putResource, postResource, deleteResource, patchResource
    ]
};

export const ServiceDesignerStory = () => {
    return (
        <ServiceDesigner
            model={serviceModel}
            onResourceAdd={handleResourceAdd}
            goToSource={handleGoToSource}
            onResourceDelete={handleResourceDelete}
            onResourceEdit={handleResourceEdit}
            onServiceEdit={handleServiceEdit}
        />
    );
};

export const ServiceDesignerStoryWithImplement = () => {
    return (
        <ServiceDesigner
            model={serviceModel}
            onResourceAdd={handleResourceAdd}
            goToSource={handleGoToSource}
            onResourceDelete={handleResourceDelete}
            onResourceEdit={handleResourceEdit}
            onServiceEdit={handleServiceEdit}
            onResourceImplement={handleResourceImplement}
        />
    );
}
