/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { Button, SidePanelBody, TextArea } from '@wso2-enterprise/ui-toolkit';
import { BallerinaRpcClient } from '@wso2-enterprise/ballerina-rpc-client';
import { FileSelect } from '../style';
import { FileSelector } from '../components/FileSelector';
import { NOT_SUPPORTED_TYPE, Type, TypeDataWithReferences } from '@wso2-enterprise/ballerina-core';
import { XMLToRecord } from '@wso2-enterprise/ballerina-core';
import styled from '@emotion/styled';

interface RecordFromXmlProps {
    name: string;
    onImport: (types: Type[]) => void;
    onCancel: () => void;
    rpcClient: BallerinaRpcClient;
}

namespace S {
    export const Container = styled(SidePanelBody)`
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;

    export const Footer = styled.div<{}>`
        display: flex;
        gap: 8px;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 8px;
        width: 100%;
    `;
}

export const RecordFromXml = (props: RecordFromXmlProps) => {
    const { name, onImport, onCancel, rpcClient } = props;
    const [xml, setXml] = useState<string>("");
    const [error, setError] = useState<string>("");

    const onXmlUpload = (xml: string) => {
        setXml(xml);
        validateXml(xml);
    }

    const validateXml = (xml: string) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");
            // Check if parsing produced an error node
            if (doc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Invalid XML");
            }
            setError("");
        } catch (e) {
            setError("Invalid XML format");
        }
    }

    const onXmlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setXml(event.target.value);
        validateXml(event.target.value);
    }

    const importXmlAsRecord = async () => {
        const resp: TypeDataWithReferences = await rpcClient.getRecordCreatorRpcClient().convertXmlToRecordType({
            xmlValue: xml,
            prefix: ""
        });

        // get the last record
        const lastRecord = resp.types[resp.types.length - 1];
        // get a list  of the records except for the last record
        const otherRecords = resp.types
            .filter((t) => t.type.name !== lastRecord.type.name)
            .map((t) => t.type);

        if (otherRecords.length > 0) {
            await rpcClient.getBIDiagramRpcClient().updateTypes({
                filePath: 'types.bal',
                types: otherRecords
            });
        }

        if (lastRecord) {
            onImport([lastRecord.type]);
        }
    }

    return (
        <>
            <h4>Import Record From XML</h4>
            <FileSelect>
                <FileSelector label="Select XML file" extension="xml" onReadFile={onXmlUpload} />
            </FileSelect>
            <TextArea
                rows={10}
                value={xml}
                onChange={onXmlChange}
                errorMsg={error}
            />
            <S.Footer>
                <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={importXmlAsRecord} disabled={!!error || !xml.trim()}>Import</Button>
            </S.Footer>
        </>
    );
};
