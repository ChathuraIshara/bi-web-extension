/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";
import { Codicon, LinkButton } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding-bottom: 24px;
`;

const Text = styled.p`
    font-size: 14px;
    margin: 8px 0;
    color: var(--vscode-sideBarTitle-foreground);
    opacity: 0.5;
`;

const ActionButton = styled(LinkButton)`
    padding: 8px 4px;
`

export interface EmptyCardProps {
    description: string;
    actionText: string;
    onClick: () => void;
}

export function EmptyCard(props: EmptyCardProps) {
    const { description, actionText, onClick } = props;
    return (
        <CardContainer>
            <Text>{description}</Text>
            <ActionButton onClick={onClick}>
                <Codicon name="add" />
                {actionText}
            </ActionButton>
        </CardContainer>
    );
}

export default EmptyCard;
