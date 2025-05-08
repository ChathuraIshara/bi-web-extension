/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { PropsWithChildren } from 'react';
import styled from "@emotion/styled";
import { Overlay } from '../Commons/Overlay';
import { colors } from '../Commons/Colors';

export interface DialogProps {
    id?: string;
    className?: string;
    isOpen?: boolean;
    onClose?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    sx?: any;
}

const Container = styled.div<DialogProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--vscode-editor-background);
    padding: 20px;
    border-radius: 4px;
    width: 300px;
    text-align: center;
    justify-content: center;
    box-shadow: var(--vscode-widget-shadow) 0px 4px 10px;
    z-index: 2001;
    ${(props: DialogProps) => props.sx};
`;

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = (props: PropsWithChildren<DialogProps>) => {
    const { id, className, isOpen, onClose, children, sx } = props;

    return (
        <div id={id} className={className}>
            {isOpen && (
                <>
                    <Overlay sx={{background: colors.vscodeEditorInactiveSelectionBackground, opacity: 0.4}} onClose={onClose} />
                    <Container sx={sx}>
                        {children}
                    </Container>
                </>
            )}
        </div>
    );
};

