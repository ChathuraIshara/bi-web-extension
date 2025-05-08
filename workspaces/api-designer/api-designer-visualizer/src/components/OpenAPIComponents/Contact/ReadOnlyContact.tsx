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
import { Contact as C } from '../../../Definitions/ServiceDefinitions';
import { DataGrid } from '../../DataGrid/DataGrid';

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const HorizontalFieldWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

interface ReadOnlyContactProps {
    contact: C;
}

export function ReadOnlyContact(props: ReadOnlyContactProps) {
    const { contact } = props;

    return (
        <ContentWrapper>
            <Typography sx={{ margin: 0 }} variant="h3">Contact</Typography>
            <DataGrid
                headers={["Property", "Value"]}
                content={[
                    ["Name", contact?.name],
                    ["URL", contact?.url],
                    ["Email", contact?.email],
                ]}
            />
        </ContentWrapper>
    )
}
