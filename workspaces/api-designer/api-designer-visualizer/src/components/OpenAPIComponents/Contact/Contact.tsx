/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Contact as C } from '../../../Definitions/ServiceDefinitions';

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

interface ContactProps {
    contact: C;
    onContactChange: (contact: C) => void;
}

export function Contact(props: ContactProps) {
    const { contact, onContactChange } = props;

    const handleContactChange = (contact: C) => {
        onContactChange(contact);
    };

    return (
        <>
            <Typography sx={{ margin: 0 }} variant="h3">Contact</Typography>
            <ContentWrapper>
                <HorizontalFieldWrapper>
                    <TextField
                        placeholder="Name"
                        id="contactName"
                        sx={{ width: "33%" }}
                        value={contact.name}
                        onBlur={(evt) => handleContactChange({ ...contact, name: evt.target.value })}
                    />
                    <TextField
                        placeholder='URL'
                        id="contactURL"
                        sx={{ width: "33%" }}
                        value={contact.url}
                        onBlur={(evt) => handleContactChange({ ...contact, url: evt.target.value })}
                    />
                    <TextField
                        placeholder='Email'
                        id="contactEmail"
                        sx={{ width: "33%" }}
                        value={contact.email}
                        onBlur={(evt) => handleContactChange({ ...contact, email: evt.target.value })}
                    />
                </HorizontalFieldWrapper>
            </ContentWrapper>
        </>
    )
}
