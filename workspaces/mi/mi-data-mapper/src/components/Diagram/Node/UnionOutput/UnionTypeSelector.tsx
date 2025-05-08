/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';

import { DMType } from '@wso2-enterprise/mi-core';
import { UnionTypeSelectorItem } from './UnionTypeSelectorItem';
import styled from '@emotion/styled';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-inline: 10px;
`;

const ItemContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.span`
 margin-bottom: 5px;
 color: var(--vscode-editorInfo-foreground);
`;

export interface UnionTypeSelectorProps {
    unionTypes: DMType[];
    onHandleSelect: (resolvedUnionType: DMType) => Promise<void>;
}

export function UnionTypeSelector(props: UnionTypeSelectorProps) {
    const { unionTypes, onHandleSelect } = props;

    return (
        <MainContainer>
            <Label>Types are ambiguous. Select one to access child fields</Label>
            <ItemContainer>
                {unionTypes?.map((dmType) => (
                    <UnionTypeSelectorItem
                        dmType={dmType}
                        onHandleSelect={onHandleSelect}
                    />
                ))}
            </ItemContainer>
        </MainContainer>
    );

}
