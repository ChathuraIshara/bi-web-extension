/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Dropdown } from '@wso2-enterprise/ui-toolkit';
import { RequestBody as R, ReferenceObject } from '../../../Definitions/ServiceDefinitions';
import SectionHeader from '../SectionHeader/SectionHeader';
import { useState } from 'react';
import styled from '@emotion/styled';
import { ReadOnlyMediaType } from '../MediaType/ReadOnlyMediaType';

interface RequestBodyProps {
    requestBody: R | ReferenceObject;
}

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const SubSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
`;

export function ReadOnlyRequestBody(props: RequestBodyProps) {
    const { requestBody } = props;
    const [selectedMediaType, setSelectedMediaType] = useState<string | undefined>(requestBody?.content && Object.keys(requestBody.content)[0]);

    const allMediaTypes = requestBody?.content && Object.keys(requestBody.content);

    return (
        <>
            <ContentWrapper>
                <SubSectionWrapper>
                    <SectionHeader
                        title="Body"
                        variant='h3'
                        actionButtons={
                            <Dropdown
                                id="media-type-dropdown"
                                value={selectedMediaType || "application/json"}
                                items={allMediaTypes?.map(mediaType => ({ label: mediaType, value: mediaType }))}
                                onValueChange={(value) => setSelectedMediaType(value)}
                            />
                        }
                    />
                    {selectedMediaType && requestBody.content[selectedMediaType] && (
                        <ReadOnlyMediaType
                            mediaType={requestBody.content[selectedMediaType]}
                            key={selectedMediaType}
                        />
                    )}
                </SubSectionWrapper>
            </ContentWrapper>
        </>
    )
}
