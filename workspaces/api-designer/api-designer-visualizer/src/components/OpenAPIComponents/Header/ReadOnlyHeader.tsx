/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { HeaderDefinition } from '../../../Definitions/ServiceDefinitions';

interface ReadOnlyHeaderProps {
    id: number;
    name: string;
    header: HeaderDefinition;
    headerTypes?: string[];
}

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export function ReadOnlyHeader(props: ReadOnlyHeaderProps) {
    const { header, name } = props;

    return (
        <>
            <HeaderContainer>
                <HeaderWrapper>
                    <Typography sx={{ margin: 0, fontWeight: "bold" }} variant='body2'> {name} </Typography>
                    <Typography
                        sx={{ margin: 0, fontWeight: "lighter" }}
                        variant='body2'>
                        {header.schema.type}
                    </Typography>
                </HeaderWrapper>
                <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body2'> {(header as HeaderDefinition).description} </Typography>
            </HeaderContainer>
        </>
    )
}
