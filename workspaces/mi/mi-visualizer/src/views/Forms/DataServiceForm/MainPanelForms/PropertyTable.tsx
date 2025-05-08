/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import {Configuration, Property} from "@wso2-enterprise/mi-core";
import { ParamConfig, ParamManager } from "@wso2-enterprise/mi-diagram";

export interface DataServicePropertyTableProps {
    setProperties: Dispatch<SetStateAction<any>>;
    properties?: any;
    type: string;
    setValue?: any;
}

export function DataServicePropertyTable(props: DataServicePropertyTableProps) {

    const paramConfigs: ParamConfig = {
        paramValues: [],
        paramFields: [
            {
                id: 0,
                type: "TextField",
                label: props.type === 'transport' ? "Name" : "Query Parameter Name",
                defaultValue: "Parameter Name",
                isRequired: true
            },
            {
                id: 1,
                type: "TextField",
                label: props.type === 'transport' ? "Value" : "Operation Parameter Name",
                defaultValue: "Parameter Value",
                isRequired: true
            }
        ]
    };

    const paramCarbonConfigs: ParamConfig = {
        paramValues: [],
        paramFields: [
            {
                id: 0,
                type: "TextField",
                label: "Carbon Username",
                defaultValue: "",
                isRequired: true
            },
            {
                id: 1,
                type: "TextField",
                label: "DB Username",
                defaultValue: "",
                isRequired: true
            },
            {
                id: 2,
                type: "TextField",
                label: "DB Password",
                defaultValue: "",
                isRequired: true
            }
        ]
    };
    const [params, setParams] = useState(props.type === 'datasource' ? paramCarbonConfigs : paramConfigs);

    useEffect(() => {
        if (props.properties != undefined) {
            params.paramValues = [];
            if (props.type === 'datasource') {
                props.properties.map((param: any) => {
                    setParams((prev: any) => {
                        return {
                            ...prev,
                            paramValues: [...prev.paramValues, {
                                id: prev.paramValues.length,
                                paramValues: [
                                    {
                                        value: param.carbonUsername
                                    },
                                    {
                                        value: param.username
                                    },
                                    {
                                        value: param.password
                                    }
                                ],
                                key: param.carbonUsername,
                                value: "username: " + param.username + "; password: " + param.password,
                            }
                            ]
                        }
                    });
                });
            } else {
                props.properties.map((param: any) => {
                    setParams((prev: any) => {
                        return {
                            ...prev,
                            paramValues: [...prev.paramValues, {
                                id: prev.paramValues.length,
                                paramValues: [
                                    {
                                        value: param.key
                                    },
                                    {
                                        value: param.value
                                    }
                                ],
                                key: param.key,
                                value: param.value,
                            }
                            ]
                        }
                    });
                });
            }
        }
    }, [props.properties]);

    const handleOnChange = (params: any) => {
        const modifiedParams = { ...params, paramValues: params.paramValues.map((param: any) => {
                return {
                    ...param,
                    key: param.paramValues[0].value,
                    value: generateDisplayValue(param)
                }
            })};
        setParams(modifiedParams);
        let propertyList: (Property | Configuration)[] = [];
        if (props.type === 'datasource') {
            params.paramValues.map((param: any) => {
                propertyList.push({carbonUsername: param.paramValues[0].value, username: param.paramValues[1].value,
                    password: param.paramValues[2].value});
            })
        } else {
            params.paramValues.map((param: any) => {
                propertyList.push({key: param.paramValues[0].value, value: param.paramValues[1].value});
            })
            if (props.type === 'transport') {
                props.setValue('authProps', propertyList, { shouldDirty: true });
            }
        }
        props.setProperties(propertyList);
    };

    const generateDisplayValue = (paramValues: any) => {
        let result;
        if (props.type === 'datasource') {
            result = "Username: " + paramValues.paramValues[1].value + "; Password: " + paramValues.paramValues[2].value;
        } else {
            result = paramValues.paramValues[1].value;
        }
        return result.trim();
    };

    return (
        <>
            <span>Parameters</span>
            <ParamManager
                paramConfigs={params}
                readonly={false}
                onChange={handleOnChange} />
        </>
    );
}
