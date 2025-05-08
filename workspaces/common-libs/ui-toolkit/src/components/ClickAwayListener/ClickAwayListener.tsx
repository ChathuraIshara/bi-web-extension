/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import React, { PropsWithChildren, useCallback, useEffect } from "react";

const Container = styled.div`
    height: fit-content;
    width: fit-content;
`;

export type ClickAwayListenerProps = {
    anchorEl?: HTMLElement | SVGGElement;
    onClickAway: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const ClickAwayListener: React.FC<PropsWithChildren<ClickAwayListenerProps>> = 
    (props: PropsWithChildren<ClickAwayListenerProps>) => {
        const { anchorEl, children, onClickAway } = props;
        const ref = React.useRef<HTMLDivElement>(null);

        const handleClickAway = useCallback((event: MouseEvent) => {
            if (
                (ref.current && !ref.current.contains(event.target as Node)) && 
                (!anchorEl?.contains(event.target as Node))
            ) {
                onClickAway();
            }
        }, [anchorEl, onClickAway]);

        useEffect(() => {
            document.addEventListener("click", handleClickAway);
            return () => {
                document.removeEventListener("click", handleClickAway);
            };
        }, [handleClickAway])

        return (
            <Container ref={ref}>
                {children}
            </Container>
        );
    }
