/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { Fragment, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { StyleBase, FnSignatureElProps } from './types';
import Typography from '../../../Typography/Typography';

/* Styled components */
const FnSignatureBody = styled.div<StyleBase>`
    width: 350px;
    height: 28px;
    display: flex;
    align-items: center;
    border-radius: 2px;
    background-color: var(--vscode-dropdown-background);
    border: 1px solid var(--vscode-menu-border);
    ${(props: StyleBase) => props.sx}
`;

const SyntaxBody = styled.div`
    display: flex;
    align-items: center;
    margin: 0 16px;
    overflow-x: auto;
    white-space: nowrap;
    scroll-behavior: smooth;
    scrollbar-width: thin;
`;

const SelectedArg = styled(Typography)`
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
    font-weight: 600;
    padding-inline: 4px;
    margin-inline: 2px;
    border-radius: 4px;
`;

export const FnSignatureEl = (props: FnSignatureElProps) => {
    const { label, args, currentArgIndex, sx } = props;
    const selectedArgRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (selectedArgRef.current) {
            selectedArgRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentArgIndex]);

    return (
        <>
            {label && (
                <FnSignatureBody sx={sx}>
                    <SyntaxBody>
                        <Typography variant="body3" sx={{ fontWeight: 600 }}>
                            {`${label}(`}
                        </Typography>
                        {args?.map((arg, index) => {
                            const lastArg = index === args.length - 1;
                            if (index === currentArgIndex) {
                                return (
                                    <Fragment key={`arg-${index}`}>
                                        <SelectedArg ref={selectedArgRef}>{arg}</SelectedArg>
                                        {!lastArg && <Typography variant="body3">{`, `}</Typography>}
                                    </Fragment>
                                );
                            }
                            return (
                                <Typography key={`arg-${index}`} variant="body3">
                                    {`${arg}${lastArg ? '' : ', '}`}
                                </Typography>
                            );
                        })}
                        <Typography variant="body3" sx={{ fontWeight: 600 }}>{`)`}</Typography>
                    </SyntaxBody>
                </FnSignatureBody>
            )}
        </>
    );
};
