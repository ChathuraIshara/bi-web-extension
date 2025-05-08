/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React from 'react';

import { ActionButtons } from '../ActionButtons/ActionButtons';
import { EditorContainer, EditorContent } from './styles';
import { Param, TypeResolver } from './TypeResolver';
import { ParamField, Parameters, isFieldEnabled } from './ParamManager';

export interface ParamProps {
    parameters: Parameters;
    paramFields: ParamField[];
    isTypeReadOnly?: boolean;
    onChange: (param: Parameters) => void;
    onSave?: (param: Parameters) => void;
    onCancel?: (param?: Parameters) => void;
}

const getParamFieldLabelFromParamId = (paramFields: ParamField[], paramId: number) => {
    const paramField = paramFields[paramId];
    return paramField?.label;
}

export function ParamEditor(props: ParamProps) {
    const { parameters, paramFields, onChange, onSave, onCancel } = props;

    const getParamComponent = (p: Param) => {
        const handleTypeResolverChange = (newParam: Param) => {
            // update the params array base on the id of the param with the new param
            const updatedParams = parameters.parameters.map(param => {
                if (param.id === newParam.id) {
                    return newParam;
                }
                return param;
            });

            const paramEnabled = updatedParams.map(param => {
                if (param.enableCondition === null || param.enableCondition) {
                    const enableCondition = param.enableCondition;
                    const paramEnabled = isFieldEnabled(updatedParams, enableCondition);
                    return {...param, isEnabled: paramEnabled};
                }
                return param;
            });
            onChange({ ...parameters, parameters: paramEnabled });
        }
        return <TypeResolver param={p} onChange={handleTypeResolverChange} />;
    }

    const handleOnCancel = () => {
        onCancel(parameters);
    };

    const handleOnSave = () => {
        onSave(parameters);
    };

    return (
        <EditorContainer>
            <EditorContent>
                {parameters?.parameters.map(param => getParamComponent({ ...param, label: getParamFieldLabelFromParamId(paramFields, param.id) }))}
            </EditorContent>
            <ActionButtons
                primaryButton={{ text: "Save", onClick: handleOnSave }}
                secondaryButton={{ text: "Cancel", onClick: handleOnCancel }}
                sx={{ justifyContent: "flex-end" }}
            />
        </EditorContainer >
    );
}
