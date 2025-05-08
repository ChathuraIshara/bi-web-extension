/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from "@emotion/styled";

export type PositionType =
    'bottom-end' |
    'bottom-start' |
    'bottom' |
    'left' |
    'right' |
    'top-end' |
    'top-start' |
    'top'
    ;

export interface Position {
    top: number;
    left: number;
}

export type ElementProperties = {
    width: number;
    height: number;
}

export interface TooltipProps {
    id?: string;
    className?: string;
    content?: string | ReactNode;
    position?: PositionType;
    sx?: any;
    containerSx?: any;
    containerPosition?: string;
}

export interface TooltipConatinerProps {
    position?: string;
    containerSx?: any;
}

const TooltipContainer = styled.div<TooltipConatinerProps>`
    position: ${(props: TooltipConatinerProps) => props.position || 'relative'};
    display: inline-block;
    cursor: pointer;
    pointer-events: auto;
    ${(props: TooltipConatinerProps) => props.containerSx}
`;

const TooltipContent = styled.div<TooltipProps>`
    position: absolute;
    width: fit-content;
    height: fit-content;
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    border: var(--vscode-editorHoverWidget-statusBarBackground) 1px solid;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
    z-index: 999999;
    ${(props: TooltipProps) => props.sx}
`;

const getOffsetByPosition = (position: PositionType, height: number, width: number): Position => {
    const offset: Position = { top: 0, left: 0 };
    switch (position) {
        case 'bottom-end':
            break;
        case 'bottom':
            offset.left = -(width / 2);
            break;
        case 'bottom-start':
            offset.left = -width;
            break;
        case 'left':
            offset.top = -(height / 2);
            offset.left = -width;
            break;
        case 'top-start':
            offset.top = -height;
            offset.left = -width;
            break;
        case 'top':
            offset.top = -height;
            offset.left = -(width / 2);
            break;
        case 'top-end':
            offset.top = -height;
            break;
        case 'right':
            offset.top = -(height / 2);
            break;
    }

    return offset;
}

const getPositionOnOverflow = (
    windowWidth: number,
    windowHeight: number,
    top: number,
    left: number,
    height: number,
    width: number
): Position => {
    const position: Position = { top, left };
    // Position on x axis
    if (left < 0) {
        position.left = 0;
    } else if (left + width > windowWidth) {
        position.left = windowWidth - width;
    }

    // Position on y axis
    if (top < 0) {
        position.top = 0;
    } else if (top + height > windowHeight) {
        position.top = windowHeight - height;
    }

    return position;
}

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = (props: PropsWithChildren<TooltipProps>) => {
    const { id, className, content, position, children, sx, containerPosition, containerSx } = props;

    const tooltipEl = React.useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [tooltipElPosition, setTooltipElPosition] = useState<Position>({ top: 0, left: 0 });
    const [timer, setTimer] = useState<number | null>(null);

    const updatePosition = (e: React.MouseEvent<HTMLDivElement>) => {
        if (timer) clearTimeout(timer);
        setTimer(setTimeout(() => {
            if (!isHovering && tooltipEl.current) {
                const { height, width } = tooltipEl.current.getBoundingClientRect() as ElementProperties;
                const { top: offsetTop, left: offsetLeft } = getOffsetByPosition(position || 'bottom-end', height, width);

                // Reset the position if it overflows the window
                const { top, left } = getPositionOnOverflow(
                    window.innerWidth,
                    window.innerHeight,
                    e.clientY + offsetTop,
                    e.clientX + offsetLeft,
                    height,
                    width
                );

                setTooltipElPosition({ top, left });
                if (!isVisible) setIsVisible(true);
            }
        }, 500))
    }

    const onMouseLeave = () => {
        if (timer) clearTimeout(timer);
        setIsVisible(false);
    }

    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [timer])

    return (
        <TooltipContainer
            id={id}
            className={className}
            position={containerPosition}
            onMouseMove={updatePosition}
            onMouseLeave={onMouseLeave}
            containerSx={containerSx}
        >
            {children}
            {content !== undefined && content !== "" && createPortal(
                <TooltipContent
                    ref={tooltipEl}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                        opacity: isVisible ? 1 : 0,
                        visibility: isVisible ? 'visible' : 'hidden',
                        ...tooltipElPosition
                    }}
                    sx={sx}
                >
                    {content}
                </TooltipContent>,
                document.body
            )}
        </TooltipContainer>
    );
};
