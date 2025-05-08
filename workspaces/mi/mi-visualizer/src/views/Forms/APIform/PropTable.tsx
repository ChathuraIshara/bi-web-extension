/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { TextField, Codicon } from "@wso2-enterprise/ui-toolkit";

const Row = styled.div({
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 0.2fr',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
}, (props: any) => ({
    paddingTop: 5,
    paddingBottom: props["is-last"] ? 0 : 5,
}));

const HeadingRow = styled(Row)`
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
`;

const Table = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10;
    padding: 0px 30px;
    border-top: 1px solid #e0e0e0;
    margin-top: 5px;
`;

const CenteredSpan = styled.span`
    text-align: center;
`;

const CustomLabel = styled.p`
    margin: 10px 0;
`;

const PropTable = ({ properties, onPropertiesChange }: any) => {
    const handlePropertyChange = (index: number, field: string, value: string) => {
        const newProperties = [...properties];
        newProperties[index] = { ...newProperties[index], [field]: value };
        onPropertiesChange(newProperties);
    }

    const handlePropertyDelete = (index: number) => {
        const newProperties = [...properties];
        newProperties.splice(index, 1);
        onPropertiesChange(newProperties);
    }

    return (
        <Table>
            <HeadingRow>
                <CenteredSpan>Name</CenteredSpan>
                <CenteredSpan>Value</CenteredSpan>
                <CenteredSpan>Remove</CenteredSpan>
            </HeadingRow>
            {properties.length > 0 ? properties.map((property: any, index: number) => (
                <Row is-last={index === properties.length - 1}>
                    <TextField
                        id='property-name'
                        value={property.name}
                        placeholder="Property name"
                        onTextChange={(text: string) => handlePropertyChange(index, "name", text)}
                    />
                    <TextField
                        id='property-value'
                        value={property.value}
                        placeholder="Property value"
                        onTextChange={(text: string) => handlePropertyChange(index, "value", text)}
                    />
                    <Codicon iconSx={{ fontSize: 18 }} name='trash' onClick={() => handlePropertyDelete(index)} />
                </Row>
            )) : (
                <CustomLabel>No Properties to display</CustomLabel>
            )}
        </Table>
    )
}

export default PropTable;
