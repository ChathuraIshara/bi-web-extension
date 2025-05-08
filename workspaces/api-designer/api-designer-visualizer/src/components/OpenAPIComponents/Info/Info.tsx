/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TextField } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Contact as C, Info as I } from '../../../Definitions/ServiceDefinitions';
import { useEffect, useState } from 'react';
import { CodeTextArea } from '../../CodeTextArea/CodeTextArea';
import { Contact } from '../Contact/Contact';
import { License } from '../License/Lisense';

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

interface InfoProps {
    info: I;
    isNewFile?: boolean;
    selectedOptions: string[];
    onInfoChange: (info: I) => void;
}

// Title, Vesrion are mandatory fields
export function Info(props: InfoProps) {
    const { info, isNewFile, selectedOptions, onInfoChange } = props;
    const [description, setDescription] = useState<string>(info?.description); // Due to the nature of the code component, this is not a controlled component   

    const handleInfoChange = (info: I) => {
        onInfoChange(info);
    };

    useEffect(() => {
        setDescription(info?.description);
    }, [info?.description]);

    return (
        <>
            <HorizontalFieldWrapper>
                <TextField
                    label="Title"
                    id="title"
                    sx={{ width: "50%" }}
                    value={info?.title}
                    onBlur={(evt) => {
                        info.title = evt.target.value;
                        handleInfoChange(info);
                    }}
                    autoFocus={isNewFile}
                />
                <TextField
                    label="API Version"
                    id="API Version"
                    sx={{ width: "50%" }}
                    value={info?.version}
                    onBlur={(evt) => {
                        info.version = evt.target.value;
                        handleInfoChange(info);
                    }}
                />
            </HorizontalFieldWrapper>
            {selectedOptions.includes("Summary") && (
                <TextField
                    label="Summary"
                    id="summary"
                    sx={{ width: "100%" }}
                    value={info?.summary}
                    onBlur={(evt) => {
                        info.summary = evt.target.value;
                        handleInfoChange(info);
                    }}
                />
            )}
            {selectedOptions.includes("Description") && (
                <CodeTextArea
                    label='Decription'
                    value={description}
                    onChange={(evt) => {
                        info.description = evt.target.value;
                        setDescription(evt.target.value);
                        handleInfoChange(info);
                    }}
                    resize="vertical"
                    growRange={{ start: 5, offset: 10 }}
                />
            )}
            {info?.contact && (
                <Contact
                    contact={info.contact}
                    onContactChange={(contact: C) => {
                        info.contact = contact;
                        handleInfoChange(info);
                    }}
                />
            )}
            {info?.license && (
                <License
                    lisense={info.license}
                    onContactChange={(license) => {
                        info.license = license;
                        handleInfoChange(info);
                    }}
                />
            )}
        </>
    )
}
