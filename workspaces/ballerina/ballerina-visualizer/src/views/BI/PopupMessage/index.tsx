/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import styled from "@emotion/styled";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";

const ViewContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3000;
    background-color: ${ThemeColors.SURFACE_BRIGHT};
    padding: 28px 56px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

// Add a backdrop for the fade effect
const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2999; // Behind the ViewContainer
    background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

interface PopupPanelProps {
    children: React.ReactNode;
    onClose: () => void;
}

export function PopupMessage(props: PopupPanelProps) {
    const { children, onClose } = props;

    return (
        <>
            <Backdrop onClick={onClose} />
            <ViewContainer>
                {/* <TopBar>
                    <div></div>
                    <Button appearance="icon" onClick={onClose}>
                        <Codicon name="close" />
                    </Button>
                </TopBar> */}
                {children}
            </ViewContainer>
        </>
    );
}

export default PopupMessage;
