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
import { HeaderDefinition } from '../../../Definitions/ServiceDefinitions';
import { BaseTypes, ParameterSchemaTypes } from '../../../constants';

const HorizontalFieldWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

interface HeaderProps {
    id: number;
    name: string;
    header: HeaderDefinition;
    headerTypes?: string[];
    onRemoveHeader: (id: number) => void;
    onHeaderChange: (header: HeaderDefinition, name: string) => void;
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
    line-height: 24px; // Reduced line height to lower the asterisk
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

export function Header(props: HeaderProps) {
    const { id, header, name, headerTypes = BaseTypes, onRemoveHeader: onRemoveParameter, onHeaderChange: onHeaderChange } = props;

    const paramTypeOptions = headerTypes.map((type) => ({ id: type, content: type, value: type }));
    const handleHeaderChange = (header: HeaderDefinition, name: string) => {
        const newHeader: HeaderDefinition = {
            schema: {
                type: header.schema.type,
            },
            description: header.description,
            required: header.required,
        };
        onHeaderChange(newHeader, name);
    };

    return (
        <HorizontalFieldWrapper>
            <TextField
                id={`headerName-${name}`}
                placeholder="Name"
                value={name}
                sx={{ width: "25%" }}
                onBlur={(evt) => handleHeaderChange({ ...header }, evt.target.value)}
            />
            <Dropdown
                id={`header-${header.schema.type}`}
                value={header.schema.type}
                containerSx={{ width: "30%" }}
                items={paramTypeOptions}
                onValueChange={(value) => handleHeaderChange({ ...header, schema: { type: value as ParameterSchemaTypes } }, name)}
            />
            <TextField
                placeholder="Description"
                value={header.description}
                sx={{ width: "45%" }}
                onBlur={(evt) => handleHeaderChange({ ...header, description: evt.target.value }, name)}
            />
                <ButtonWrapperParams>
                    <Tooltip content="Make this heaader optional/required">
                        <RequiredElementWrapper onClick={() => handleHeaderChange({ ...header, required: !header.required }, name)}>
                            <RequiredElement
                                color={header.required ? "var(--vscode-errorForeground)" : "var(--vscode-editor-foreground)"}
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
