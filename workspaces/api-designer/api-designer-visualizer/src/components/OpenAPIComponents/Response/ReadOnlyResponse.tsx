/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Response as R } from '../../../Definitions/ServiceDefinitions';
import { useState } from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { Dropdown, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { ReadOnlyMediaType } from '../MediaType/ReadOnlyMediaType';
import { ReadOnlyHeaders } from '../Headers/ReadOnlyHeaders';

const SubSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
`;
export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const ResponseTabContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

interface ResponseProps {
    response: R;
}

export function ReadOnlyResponse(props: ResponseProps) {
    const { response } = props;
    const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(response?.content && Object.keys(response?.content)[0]);

    const allMediaTypes = response?.content && Object.keys(response?.content);

    return (
        <ResponseTabContainer>
            {response.description && (
                <Typography sx={{ margin: '10px 0 0 0', fontWeight: "lighter" }} variant='body2'> {response.description} </Typography>
            )}
            {response?.headers && (
                <ReadOnlyHeaders
                    headers={response?.headers}
                />
            )}
            <ContentWrapper>
                <SubSectionWrapper>
                    <SectionHeader
                        title="Body"
                        variant='h3'
                        actionButtons={
                            (allMediaTypes?.length) > 0 && (
                                <Dropdown
                                    id="media-type-dropdown"
                                    value={selectedMediaType || "application/json"}
                                    items={allMediaTypes?.map(mediaType => ({ label: mediaType, value: mediaType }))}
                                    onValueChange={(value) => setSelectedMediaType(value)}
                                />
                            )
                        }
                    />
                    <div id={selectedMediaType}>
                        {selectedMediaType && response?.content && (
                            <ReadOnlyMediaType
                                mediaType={response?.content[selectedMediaType]}
                                key={selectedMediaType}
                            />
                        )}
                    </div>
                </SubSectionWrapper>
            </ContentWrapper>
            {allMediaTypes?.length === 0 && (
                <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body2'> No content available </Typography>
            )}
        </ResponseTabContainer>
    )
}
