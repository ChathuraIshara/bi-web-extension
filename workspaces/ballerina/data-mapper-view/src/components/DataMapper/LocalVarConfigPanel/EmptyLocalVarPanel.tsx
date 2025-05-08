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
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import { useStyles } from "./style";

const EmptyLocalVarContainer = styled.div`
    width: 100%;
    height: 120px;
    padding: 15px;
    background-color: var(--vscode-inputValidation-infoBackground);
    color: var(--vscode-input-foreground);
`;

const AlertText = styled.p`
    margin-bottom: 10px;
`;

interface EmptyLocalVarPanelProps {
    onAddNewVar: () => void;
}

export function EmptyLocalVarPanel(props: EmptyLocalVarPanelProps) {
    const { onAddNewVar } = props;
    const overlayClasses = useStyles();

    return (
        <EmptyLocalVarContainer>
            <AlertText>You do not have any local variable in this transformation.</AlertText>
            <Button
                appearance="icon"
                onClick={onAddNewVar}
                className={overlayClasses.linePrimaryButton} 
                sx={{width: '100%'}}
            >
                <Codicon sx={{marginTop: 2, marginRight: 5}} name="add"/>
                <div>Add New</div>
            </Button>
        </EmptyLocalVarContainer>
    );
}
