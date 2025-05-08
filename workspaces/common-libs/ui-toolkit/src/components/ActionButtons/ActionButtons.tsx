/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

interface ButtonProps {
    text: string;
    tooltip?: string;
    disabled?: boolean;
    onClick?: () => void;
}

interface ButtonContainerProps {
    sx: any;
}

export interface ActionButtonsProps {
    id?: string;
    className?: string;
    primaryButton: ButtonProps;
    secondaryButton: ButtonProps;
    sx?: any;
}

const ButtonContainer = styled.div<ButtonContainerProps>`
    display: flex;
    flex-direction: row;
    ${(props: ButtonContainerProps) => props.sx};
`;

const ButtonWrapper = styled.div`
    min-width: 50px;
`;

export const ActionButtons = (props: ActionButtonsProps) => {
    const { id, className, primaryButton, secondaryButton, sx } = props;
    const { tooltip: pTooltip, text: pText, onClick: pOnClick, disabled: pDisabled } = primaryButton;
    const { tooltip: sTooltip, text: sText, onClick: sOnClick, disabled: sDisabled } = secondaryButton;

    return (
        <ButtonContainer id={id} className={className} sx={sx}>
            <VSCodeButton appearance="secondary" onClick={sOnClick} title={sTooltip} disabled={(sDisabled ? true : undefined)} style={{marginRight: 8}}>
                <ButtonWrapper style={{minWidth: "50px"}}>{sText}</ButtonWrapper>
            </VSCodeButton>
            <VSCodeButton appearance="primary" onClick={pOnClick} title={pTooltip} disabled={(pDisabled ? true : undefined)}>
                <ButtonWrapper style={{minWidth: "50px"}}>{pText}</ButtonWrapper>
            </VSCodeButton>
        </ButtonContainer>
    );
};
