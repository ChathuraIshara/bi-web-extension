/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Parameter as P } from "../../../Definitions/ServiceDefinitions";
import { Parameter } from "./Parameter";
import { ReadOnlyParameter } from "./ReadOnlyParameter";

export default {
    component: Parameter,
    title: 'New Parameter',
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

export const ParameterStory = () => {
    return (
        <Parameter id={1} parameter={parameter} onRemoveParameter={null} onParameterChange={() => {}} />
    );
};

export const ReadOnlyParameterStory = () => {
    return (
        <ReadOnlyParameter parameter={parameter} />
    );
}
