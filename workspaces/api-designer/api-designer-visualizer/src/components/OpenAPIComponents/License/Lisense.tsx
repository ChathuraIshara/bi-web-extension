/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Dropdown, TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { License as L } from '../../../Definitions/ServiceDefinitions';

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const SubSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    gap: 5px;
`;

const HorizontalFieldWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

interface LicenseProps {
    lisense: L;
    onContactChange: (license: L) => void;
}

export function License(props: LicenseProps) {
    const { lisense } = props;

    const handleContactChange = (license: L) => {
        props.onContactChange(license);
    };

    const handleLicenceTypeChange = (licenceType: string) => {
        if (licenceType === "URL") {
            lisense.url = lisense.identifier;
            delete lisense.identifier;
        } else {
            lisense.identifier = lisense.url;
            delete lisense.url;
        }
        handleContactChange(lisense);
    };

    return (
        <ContentWrapper>
            <Typography sx={{ margin: 0 }} variant="h3">License</Typography>
            <HorizontalFieldWrapper>
                <TextField
                    placeholder="Name"
                    id="licenceName"
                    sx={{ width: "33%" }}
                    value={lisense.name}
                    onBlur={(evt) => handleContactChange({ ...lisense, name: evt.target.value })}
                />
                <Dropdown
                    id="licenceType"
                    containerSx={{ width: "33%", gap: 0 }}
                    dropdownContainerSx={{ gap: 0 }}
                    items={[
                        { value: "URL", content: "URL" },
                        { value: "Identifier", content: "Identifier" }
                    ]}
                    value={lisense.url ? "URL" : "Identifier"}
                    onValueChange={(value) => handleLicenceTypeChange(value)}
                />
                {lisense.url ? (
                    <TextField
                        placeholder='URL'
                        id="licenceURL"
                        sx={{ width: "33%" }}
                        value={lisense.url}
                        onBlur={(evt) => handleContactChange({ ...lisense, url: evt.target.value })}
                    />
                ) : (
                    <TextField
                        placeholder='Identifier'
                        id="licenceIdentifier"
                        sx={{ width: "33%" }}
                        value={lisense.identifier}
                        onBlur={(evt) => handleContactChange({ ...lisense, identifier: evt.target.value })}
                    />
                )}
            </HorizontalFieldWrapper>
        </ContentWrapper>
    )
}
