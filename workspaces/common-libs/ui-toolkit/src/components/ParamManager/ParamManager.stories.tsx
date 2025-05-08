/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { ParamConfig, ParamField, ParamManager, Parameters } from "./ParamManager";

const generateSpaceSeperatedStringFromParamValues = (paramValues: Parameters) => {
    let result = "";
    paramValues.parameters.forEach(param => {
        result += param.value + " ";
    });
    return result.trim();
};

// Sample object for ParamManager
const paramConfigs: ParamConfig = {
    paramValues: [
        {
            id: 0,
            parameters: [
                {
                    id: 0,
                    label: "Type",
                    type: "TextField",
                    value: "int",
                    isRequired: true
                },
                {
                    id: 1,
                    label: "Name",
                    type: "TextField",
                    value: "var1",
                    isRequired: true
                },
                {
                    id: 2,
                    label: "Dropdown Sample",
                    type: "Dropdown",
                    value: "0",
                    isRequired: false,
                    values: ["0", "1", "2"],
                },
                {
                    id: 3,
                    label: "Is Required",
                    type: "Checkbox",
                    value: true,
                    isRequired: false
                },
                {
                    id: 4,
                    label: "Description",
                    type: "TextArea",
                    value: "This is a description",
                    isRequired: false
                }
            ],
            key: "Key 1",
            value: "Int var1 0 true This is a description",
            icon: "query"
        }
    ],
    paramFields: [
        {
            type: "TextField",
            label: "Type",
            defaultValue: "John Doe",
            isRequired: true
        },
        {
            type: "TextField",
            label: "Name",
            defaultValue: "var",
            isRequired: true
        },
        {
            type: "Dropdown",
            label: "Dropdown Sample",
            defaultValue: "0",
            isRequired: false,
            values: ["0", "1", "2"]
        },
        {
            type: "Checkbox",
            label: "Is Required",
            defaultValue: true,
            isRequired: false
        },
        {
            type: "TextArea",
            label: "Description",
            defaultValue: "This is a description",
            isRequired: false
        }
    ]
};

const ParamManagerDefault = () => {
    const [params, setParams] = useState(paramConfigs);
    const handleOnChange = (params: ParamConfig) => {
        const modifiedParams = { ...params, paramValues: params.paramValues.map((param, index) => {
            return {
                ...param,
                key: `Key ${index + 1}`,
                value: generateSpaceSeperatedStringFromParamValues(param)
            }
        })};
        setParams(modifiedParams);
    };

    return (
        <>
            <ParamManager paramConfigs={params} readonly={false} onChange={handleOnChange} />
        </>
    );
};

storiesOf("Param Manager").add("Manager", () => <ParamManagerDefault />);

// Add a sample enableCondition (ConditionParams | string)[] object
const paramFields: ParamField[] = [
    {
        id: 0,
        type: "TextField",
        label: "Text Field",
        defaultValue: "default value",
        isRequired: true
    },
    {
        id: 1,
        type: "Dropdown",
        label: "Drop Down",
        defaultValue: "1",
        values: ["1", "2", "3"],
    },
    {
        id: 2,
        type: "Checkbox",
        label: "Checkbox",
        defaultValue: false,
        enableCondition: [
            "OR",
            { 1: "2", 0: "2" }
        ]
    },
    {
        id: 3,
        type: "TextArea",
        label: "Text Area",
        defaultValue: "Test"
    }
];

const config: ParamConfig = {
    paramValues: [],
    paramFields: paramFields
};

const EnableCondition = () => {
    const [params, setParams] = useState(config);
    const handleOnChange = (params: ParamConfig) => {
        const modifiedParams = { ...params, paramValues: params.paramValues.map((param, index) => {
            return {
                ...param,
                key: `Key ${index + 1}`,
                value: generateSpaceSeperatedStringFromParamValues(param)
            }
        })};
        setParams(modifiedParams);
    };

    return (
        <>
            <ParamManager paramConfigs={params} readonly={false} onChange={handleOnChange} />
        </>
    );
};

storiesOf("Param Manager").add("Enable Condition", () => <EnableCondition />);

// Add a sample enableCondition (ConditionParams | string)[] object
const paramFieldsWithEmptyLogicalExpr: ParamField[] = [
    {
        id: 0,
        type: "TextField",
        label: "Text Field",
        defaultValue: "default value",
        isRequired: true
    },
    {
        id: 1,
        type: "Dropdown",
        label: "Drop Down",
        defaultValue: "1",
        values: ["1", "2", "3"],
    },
    {
        id: 2,
        type: "Checkbox",
        label: "Checkbox",
        defaultValue: false,
        enableCondition: [
            { 1 : "2" }
        ]
    },
    {
        id: 3,
        type: "TextArea",
        label: "Text Area",
        defaultValue: "Test"
    }
];

const emptyLogicalExpr: ParamConfig = {
    paramValues: [],
    paramFields: paramFieldsWithEmptyLogicalExpr
};

const EmptyLogicCondition = () => {
    const [params, setParams] = useState(emptyLogicalExpr);
    const handleOnChange = (params: ParamConfig) => {
        const modifiedParams = { ...params, paramValues: params.paramValues.map((param, index) => {
            return {
                ...param,
                key: `Key ${index + 1}`,
                value: generateSpaceSeperatedStringFromParamValues(param)
            }
        })};
        setParams(modifiedParams);
    };

    return (
        <>
            <ParamManager paramConfigs={params} readonly={false} onChange={handleOnChange} />
        </>
    );
};

storiesOf("Param Manager").add("Empty Logical Condition", () => <EmptyLogicCondition />);
