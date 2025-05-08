/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, Codicon, Dropdown, TextField, Tooltip } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Parameter as P } from '../../../Definitions/ServiceDefinitions';
import { BaseTypes, ParameterSchemaTypes } from '../../../constants';

const HorizontalFieldWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

interface ParameterProps {
    id: number;
    parameter: P;
    paramTypes?: string[];
    onRemoveParameter: (id: number) => void;
    onParameterChange: (parameter: P) => void;
}
const ButtonWrapperParams = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 40px;
    flex-grow: 1;
    gap: 5px;
    justify-content: flex-end;
`;

interface RequiredFormInputProps {
    color?: string;
}
const RequiredElement = styled.div<RequiredFormInputProps>`
    font-size: 28px;
    color: ${(props: RequiredFormInputProps) => props.color || "var(--vscode-editor-foreground)"};
    font-weight: bold;
    line-height: 24px;
    cursor: pointer;
`;
const RequiredElementWrapper = styled.div`
    height: 15px;
    padding: 2px;
    border-radius: 4px;
    &:hover {
        background-color: var(--button-icon-hover-background)
    }
`;

export function Parameter(props: ParameterProps) {
    const { id, parameter, paramTypes = BaseTypes, onRemoveParameter, onParameterChange } = props;

    const paramTypeOptions = paramTypes.map((type) => ({ id: type, content: type, value: type }));
    const handleParameterChange = (parameter: P) => {
        onParameterChange(parameter);
    };

    return (
        <HorizontalFieldWrapper>
            <TextField
                id={`paramName-${parameter.name}`}
                placeholder="Name"
                value={parameter.name}
                sx={{ width: "25%" }}
                onBlur={(evt) => handleParameterChange({ ...parameter, name: evt.target.value })}
            />
            <Dropdown
                id={`paramType-${parameter.name}`}
                value={parameter.schema.type}
                containerSx={{ width: "30%" }}
                items={paramTypeOptions}
                onValueChange={(value) => handleParameterChange({ ...parameter, schema: { type: value as ParameterSchemaTypes } })}
            />
            <TextField
                placeholder="Description"
                value={parameter.description}
                sx={{ width: "45%" }}
                onBlur={(evt) => handleParameterChange({ ...parameter, description: evt.target.value })}
            />
                <ButtonWrapperParams>
                    <Tooltip content="Make this parameter optional/required">
                        <RequiredElementWrapper onClick={() => handleParameterChange({ ...parameter, required: !parameter.required })}>
                            <RequiredElement
                                color={parameter.isRequired ? "var(--vscode-errorForeground)" : "var(--vscode-editor-foreground)"}
                            >
                                *
                            </RequiredElement>
                        </RequiredElementWrapper>
                    </Tooltip>
                    <Button appearance='icon' onClick={() => onRemoveParameter(id)}>
                        <Codicon name="trash" />
                    </Button>
                </ButtonWrapperParams>
            </HorizontalFieldWrapper>
    )
}
