/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import { useIntl } from "react-intl";
import styled from "@emotion/styled";
import { Button, Codicon, Icon, SidePanelTitleContainer, Typography } from "@wso2-enterprise/ui-toolkit";
import { RecordFormWrapper } from "../style";

export interface RecordConfigTypeProps {
    isDataMapper?: boolean;
    onImportFromJson: () => void;
    onImportFromXml: () => void;
    onCancel: () => void;
}

namespace S {
    export const Row = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
    `;

    export const StyledButton = styled(Button)`
        border-radius: 5px;
    `;
}

export function RecordConfigTypeSelector(props: RecordConfigTypeProps) {
    const { isDataMapper, onImportFromJson, onImportFromXml, onCancel } = props;
    const intl = useIntl();
    const importJsonButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.recordEditor.option.importJson",
        defaultMessage: "Import a JSON",
    });
    const importXmlButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.recordEditor.option.importXml",
        defaultMessage: "Import an XML",
    });

    return (
        <>
            {!isDataMapper && (
                <SidePanelTitleContainer sx={{ paddingLeft: 20 }}>
                    <Typography variant="h3" sx={{margin: 0, fontSize: "13px"}}>Create Record</Typography>
                    <Button onClick={onCancel} appearance="icon"><Codicon name="close" /></Button>
                </SidePanelTitleContainer>
            )}
            <RecordFormWrapper>
                <CreateButtonWrapper>
                    <LinePrimaryButton
                        appearance="icon"
                        sx={{
                            backgroundColor: "var(--vscode-button-hoverBackground)",
                            width: "100%",
                        }}
                        onClick={onImportFromJson}
                        data-test-id="import-json"
                    >
                        <Icon
                            sx={{ height: "18px", width: "18px", marginRight: "4px" }}
                            iconSx={{ fontSize: "18px", color: "var(--vscode-button-foreground)" }}
                            name="file-upload"
                        />
                        <LineButtonTitle variant="h4">{importJsonButtonText}</LineButtonTitle>
                    </LinePrimaryButton>

                    <LinePrimaryButton
                        appearance="icon"
                        sx={{
                            backgroundColor: "var(--vscode-button-hoverBackground)",
                            width: "100%"
                        }}
                        onClick={onImportFromXml}
                        data-test-id="import-xml"
                        disabled={onImportFromXml === null}
                    >
                        <Icon
                            sx={{ height: "18px", width: "18px", marginRight: "4px" }}
                            iconSx={{ fontSize: "18px", color: "var(--vscode-button-foreground)" }}
                            name="file-upload"
                        />
                        <LineButtonTitle variant="h4">{importXmlButtonText}</LineButtonTitle>
                    </LinePrimaryButton>
                    {onImportFromXml === null && (
                        <BallerinaLabel>
                            To enable XML import, update the Ballerina version to 2201.7.2 or later.
                        </BallerinaLabel>
                    )}
                </CreateButtonWrapper>
            </RecordFormWrapper>
        </>
    );
}

const CreateButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    & button {
        margin-bottom: 16px;
    }
`;

const BallerinaLabel = styled.p`
    color: #4a4d55;
    font-size: 13;
    text-transform: capitalize;
    font-weight: 300;
    text-align: end;
`;

const LinePrimaryButton = styled(Button)`
    width: 100% !important;

    & vscode-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const LineButtonTitle = styled(Typography)`
    margin: 0;
    color: var(--vscode-button-foreground);
`;
