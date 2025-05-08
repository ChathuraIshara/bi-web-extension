/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TypeWithIdentifier, VarIcon } from "@wso2-enterprise/ballerina-core";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import { VariableTree } from "./VariablesTree";
import styled from "@emotion/styled";
import { useState } from "react";
import { IconContainer, VariableComponent, VariableName, VariableType } from "../VariablesView";
import { getIcon, getName, getTypeName } from "./utils";

interface RecordTypeTreeProps {
    variable: TypeWithIdentifier;
    depth: number;
    handleOnClick: (variable: string) => void;
    parentValue?: string;
    isOptional?: boolean;
}

const SubList = styled.div`
        margin-left: 20px;
        margin-bottom: 8px;
        padding-left: 20px;
        flex-direction: column;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
`;

export function RecordTypeTree(props: RecordTypeTreeProps) {
    const { variable, depth, handleOnClick, parentValue, isOptional } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleFieldClick = (fieldName: string) => {
        handleOnClick(fieldName);
    };

    const renderFields = () => {
        if (depth > 0 && !isExpanded) {
            return null;
        }

        return (
            <SubList>
                {variable.type.fields.map((field, index) => {
                    const fullPath = parentValue
                        ? `${parentValue}${field?.optional ? '?' : ''}.${field.name}`
                        : `${variable.name}${field?.optional ? '?' : ''}.${field.name}`;
                    if (field.typeName && field.name && field.typeName !== 'record') {
                        return (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <VariableComponent onClick={() => handleFieldClick(`${fullPath}`)}>
                                    <IconContainer>
                                        {getIcon(field.typeName === 'record' ? field.typeName : 'field')}
                                    </IconContainer>
                                    <VariableName>
                                        {getName(field.name, field?.optional)}
                                    </VariableName>
                                    <VariableType>
                                        {getTypeName(field)}
                                    </VariableType>
                                </VariableComponent>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index}>
                                <VariableTree
                                variable={{ name: field.name, type: field }}
                                depth={depth + 1}
                                parentValue={fullPath}
                                handleOnSelection={handleOnClick}
                                isOptional={field?.optional}
                                />
                            </div>
                        );
                    }
                })}
            </SubList>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InfoContainer>
                {depth > 0 && (
                    <Button appearance="icon" onClick={toggleExpand} >
                        {isExpanded ? <Codicon name="chevron-up" /> : <Codicon name="chevron-down" />}
                    </Button>
                )}
                <VariableComponent onClick={() => handleFieldClick(parentValue ? `${parentValue}` : `${variable.name}`)}>
                    {!parentValue && (
                        <IconContainer>
                            {getIcon(variable?.type?.typeName)}
                        </IconContainer>
                    )}
                    {parentValue && (
                        <IconContainer>
                            {getIcon(variable?.type?.typeName === 'record' ? variable?.type?.typeName : 'field')}
                        </IconContainer>
                    )}
                    <VariableName>
                        {getName(variable.name, isOptional)}
                    </VariableName>
                    <VariableType>
                        {getTypeName(variable.type)}
                    </VariableType>
                </VariableComponent>
            </InfoContainer>
            {variable.type.fields.length > 0 && renderFields()}
        </div>
    );
}
