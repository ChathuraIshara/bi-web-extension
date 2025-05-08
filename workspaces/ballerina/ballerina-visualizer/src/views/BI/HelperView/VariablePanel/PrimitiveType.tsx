/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TypeWithIdentifier, VarIcon } from '@wso2-enterprise/ballerina-core';

import { IconContainer, VariableComponent, VariableName, VariableType } from '../VariablesView';
import { getIcon, getTypeName } from './utils';

interface PrimitiveTypeProps {
    variable: TypeWithIdentifier;
    handleOnClick: (name: string) => void;
}
export function PrimitiveType(props: PrimitiveTypeProps) {
    const { variable, handleOnClick } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <VariableComponent onClick={() => handleOnClick(variable.name)}>
                <IconContainer>
                    {getIcon(variable.type.typeName)}
                </IconContainer>
                <VariableName>
                    {variable.name}
                </VariableName>
                <VariableType>
                    {getTypeName(variable.type)}
                </VariableType>
            </VariableComponent>
        </div>
    );
}
