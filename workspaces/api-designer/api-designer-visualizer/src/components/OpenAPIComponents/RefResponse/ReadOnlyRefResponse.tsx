/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import { Response as R } from '../../../Definitions/ServiceDefinitions';
import styled from '@emotion/styled';
import { ReadOnlyResponse } from '../Response/ReadOnlyResponse';

const PanelBody = styled.div`
    height: calc(100% - 87px);
    overflow-y: auto;
    padding: 16px;
    gap: 15px;
    display: flex;
    flex-direction: column;
`;
const PathWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export interface ReadOnlyResponseProps {
    name: string;
    response: R;
}

export function ReadOnlyRefResponse(props: ReadOnlyResponseProps) {
    const { response, name } = props;

    return (
        <PanelBody>
            <Typography sx={{ margin: 0, marginTop: 0, flex: 1 }} variant="h2">Response</Typography>
            <PathWrapper>
                <Typography sx={{ margin: 0, marginTop: 4 }} variant="body3">{name}</Typography>
                <ReadOnlyResponse response={response} />
            </PathWrapper>
        </PanelBody>
    )
}
