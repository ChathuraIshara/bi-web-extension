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
import { License as L } from '../../../Definitions/ServiceDefinitions';
import { DataGrid } from '../../DataGrid/DataGrid';

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

interface ReadOnlyLicenseProps {
    license: L;
}

export function ReadOnlyLicense(props: ReadOnlyLicenseProps) {
    const { license } = props;

    return (
        <ContentWrapper>
            <Typography sx={{ margin: 0 }} variant="h3">License</Typography>
            <DataGrid
                headers={["Property", "Value"]}
                content={[
                    ["Name", license?.name],
                    license?.url ?
                        ["URL",
                            license?.url
                        ] :
                        [
                            "Identifier",
                            license?.identifier,
                        ],
                ]}
            />
        </ContentWrapper>
    )
}
