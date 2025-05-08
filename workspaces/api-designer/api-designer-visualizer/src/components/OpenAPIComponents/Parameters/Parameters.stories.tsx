/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Parameter as P, ReferenceObject as R } from "../../../Definitions/ServiceDefinitions";
import { Parameters } from "./Parameters";
import { ReadOnlyParameters } from "./ReadOnlyParameters";

export default {
    component: Parameters,
    title: 'New Parameters',
};

const parameter: P = {
    name: "name",
    in: "query",
    description: "description",
    required: true,
    schema: {
        type: "string",
    },
};

const parameters: P[] = [parameter];

export const ParametersStory = () => {
    const [parameters, setParameters] = useState<P[]>([parameter]);
    const onParametersChange = (parameters: (P | R) []) => {
        console.log(parameters);
        setParameters(parameters as P[]);
    }
    return (
        <Parameters title="Query Parameters" type="query" parameters={parameters} onParametersChange={onParametersChange} currentReferences={currentReferenceObjects} />
    );
};

const referenceObj: R = {
    $ref: "http://example.com",
    description: "description",
    summary: "summary",
};

const currentReferenceObjects: R[] = [
    {
        $ref: "http://example1.com",
        description: "description",
        summary: "summary",
    },
    {
        $ref: "http://example2.com",
        description: "description",
        summary: "summary",
    },
];

const referenceObject: R[] = [referenceObj];

export const ParametersStoryWithReferenceObject = () => {
    const [referenceObjects, setReferenceObjects] = useState<R[]>([referenceObj]);
    const onReferenceObjectsChange = (referenceObjects: (P | R) []) => {
        console.log(referenceObjects);
        setReferenceObjects(referenceObjects as R[]);
    }
    return (
        <Parameters title="Query Parameters" type="query" parameters={referenceObjects} onParametersChange={onReferenceObjectsChange} currentReferences={currentReferenceObjects} />
    );
}

export const ReadOnlyParametersStory = () => {
    return (
        <ReadOnlyParameters title="Query Parameters" type="query" parameters={parameters} />
    );
}
