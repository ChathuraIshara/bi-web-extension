/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Parameter } from "../../../Definitions/ServiceDefinitions";
import { RefParameter } from "./RefParameter";

export default {
    component: RefParameter,
    title: 'New Ref Parameter',
};

const p: Parameter = {
    name: "test",
    in: "query",
    description: "Test Description",
    required: true,
    schema: {
        type: "string",
    },
};

export const RefParameterStory = () => {
    const [param, setParam] = useState<Parameter>(p);
    const [name, setName] = useState<string>("Test");
    const onParameterChange = (parameter: Parameter, name: string) => {
        setParam(parameter);
        setName(name);
    }
    return (
        <RefParameter
            paramerName={name}
            parameter={param}
            onParameterChange={onParameterChange}
        />
    );
};
