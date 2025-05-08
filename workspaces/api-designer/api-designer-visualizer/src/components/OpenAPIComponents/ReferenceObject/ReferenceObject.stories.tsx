/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ReferenceObject as R } from "../../../Definitions/ServiceDefinitions";
import { ReferenceObject } from "./ReferenceObject";

export default {
    component: ReferenceObject,
    title: 'New Reference Object',
};

const referenceObj: R = {
    $ref: "http://example.com",
    description: "description",
    summary: "summary",
};


export const ParameterStory = () => {
    return (
        <ReferenceObject id={1} referenceObject={referenceObj} onRemoveReferenceObject={null} onRefernceObjectChange={() => {}} />
    );
};
