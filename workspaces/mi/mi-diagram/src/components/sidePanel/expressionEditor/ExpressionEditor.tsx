/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { useForm, Controller } from 'react-hook-form';
import { TextField } from '@wso2-enterprise/ui-toolkit';
import { ActionButtons } from '@wso2-enterprise/ui-toolkit';
import SidePanelContext from "../SidePanelContexProvider";
import { ExpressionFieldValue } from "../../Form/ExpressionField/ExpressionInput";
import { ParamConfig, ParamManager } from "../../Form/ParamManager/ParamManager";

export interface Namespace {
    prefix: string;
    uri: string;
}

export interface ExpressionEditorProps {
    value: ExpressionFieldValue;
    handleOnCancel: () => void;
    handleOnSave: (data: ExpressionFieldValue) => void;
}
export const ExpressionEditor = (props: ExpressionEditorProps) => {
    const data: ExpressionFieldValue = props.value;

    const { control, handleSubmit } = useForm({
        defaultValues: {
            expressionValue: data.value,
            namespaces: {
                paramValues: data?.namespaces && data.namespaces.map((namespace: Namespace, index: number) => (
                    {
                        id: index,
                        key: namespace.prefix,
                        value: namespace.uri,
                        icon: 'query',
                        paramValues: [
                            { value: namespace.prefix },
                            { value: namespace.uri },
                        ]
                    }
                )) || [],
                paramFields: [
                    {
                        "type": "TextField" as "TextField",
                        "label": "Prefix",
                        "defaultValue": "",
                        "isRequired": false,
                        "canChange": false
                    },
                    {
                        "type": "TextField" as "TextField",
                        "label": "URI",
                        "defaultValue": "",
                        "isRequired": false,
                        "canChange": false
                    },
                ]
            },
        }
    });

    const onSubmit = (data: any) => {
        props.handleOnSave({
            value: data.expressionValue,
            namespaces: data.namespaces.paramValues.map((param: any) => { return { 'prefix': param.key, 'uri': param.value } }),
            isExpression: true
        });
    }

    return (
        <div style={{ padding: "25px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Controller
                        name="expressionValue"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Expression Value" size={50} placeholder="Expression Value" />
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="namespaces"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <ParamManager
                                paramConfigs={value}
                                readonly={false}
                                addParamText="Add Namespace"
                                onChange={(values: ParamConfig) => {
                                    values.paramValues = values.paramValues.map((param: any) => {
                                        const paramValues = param.paramValues;
                                        param.key = paramValues[0].value;
                                        param.value = paramValues[1].value;
                                        param.icon = 'query';
                                        return param;
                                    });
                                    onChange(values);
                                }}
                            />
                        )}
                    />
                </div>
                <ActionButtons
                    primaryButton={{ text: "Save", onClick: handleSubmit(onSubmit) }}
                    secondaryButton={{ text: "Cancel", onClick: props.handleOnCancel }}
                    sx={{ justifyContent: "flex-end" }}
                />
            </form >
        </div >
    );
};

export default ExpressionEditor;