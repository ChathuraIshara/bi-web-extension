/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TypeField } from "@wso2-enterprise/ballerina-core";

import styled from "@emotion/styled";
import { MemoizedParameterBranch } from "./RecordConstructView/ParameterBranch";

interface ConfigureViewProps {
    recordModel: TypeField[];
    onModelChange: (updatedModel: TypeField[]) => void;
}

export const LabelContainer = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: '10px'
});

export const Description = styled.div({
    color: 'var(--vscode-list-deemphasizedForeground)',
});

const Label = styled.div<{}>`
    font-size: 14px;
    font-family: GilmerBold;
    padding-top: 10px;
    padding-bottom: 10px;
    text-wrap: nowrap;
`;

export const PanelBody = styled.div`
    height: 100vh;
`;


export function RecordConfigView(props: ConfigureViewProps) {
    const { recordModel, onModelChange } = props;

    const handleOnChange = async () => {
        onModelChange(recordModel);
    }

    return (
        <PanelBody>
            <>
                <LabelContainer>
                    <Description >{`Select fields to construct the record`}</Description>
                </LabelContainer>
                <MemoizedParameterBranch key={JSON.stringify(recordModel)} parameters={recordModel} depth={1} onChange={handleOnChange} />
            </>
        </PanelBody>
    );
}
