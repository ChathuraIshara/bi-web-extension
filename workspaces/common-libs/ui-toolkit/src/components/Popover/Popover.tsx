/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { PropsWithChildren } from "react";
import "@wso2-enterprise/font-wso2-vscode/dist/wso2-vscode.css";

import styled from "@emotion/styled";
import { createPortal } from "react-dom";
import { SxStyle } from "../Commons/Definitions";
import { ClickAwayListener } from "../ClickAwayListener/ClickAwayListener";
import { debounce } from "lodash";

interface Position {
    top: number;
    left: number;
}

interface Origin {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
}

export interface ContainerProps {
	top?: number;
    left?: number;
    sx?: SxStyle;
}

const StyledPopover = styled.div<ContainerProps>`
    position: absolute;
    z-index: 200;
    background-color: #fff;
    padding: 8px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 14px;
    line-height: 20px;
    color: #333;
    top: ${(props: ContainerProps) => `${props.top}px`};
    left: ${(props: ContainerProps) => `${props.left}px`};
    ${(props: ContainerProps) => props.sx};
`;
  
export interface PopoverProps {
    open: boolean;
    anchorEl: HTMLElement | SVGGElement | null;
    anchorOrigin?: Origin;
    transformOrigin?: Origin;
    sx?: SxStyle;
    id?: string;
    handleClose?: () => void;
}

const calculateAnchorOffset = (ref: HTMLElement | SVGGElement, origin: Origin): Position => {
    const rect = ref.getBoundingClientRect();
    const { vertical, horizontal } = origin;
    let top = 0;
    let left = 0;

    if (vertical === "center") {
        top += rect.height / 2;
    } else if (vertical === "bottom") {
        top += rect.height;
    }

    if (horizontal === "center") {
        left += rect.width / 2;
    } else if (horizontal === "right") {
        left += rect.width;
    }

    return { top, left };
}

const calculateTransformOffset = (ref: HTMLDivElement, origin: Origin): Position => {
    const rect = ref.getBoundingClientRect();
    const { vertical, horizontal } = origin;
    let top = 0;
    let left = 0;

    if (vertical === "center") {
        top -= rect.height / 2;
    } else if (vertical === "bottom") {
        top -= rect.height;
    }

    if (horizontal === "center") {
        left -= rect.width / 2;
    } else if (horizontal === "right") {
        left -= rect.width;
    }

    return { top, left };
}

export const Popover: React.FC<PropsWithChildren<PopoverProps>> = 
    (props: PropsWithChildren<PopoverProps>) => {
        const { open, id, anchorEl: anchorEvent, sx, children, handleClose, anchorOrigin, transformOrigin } = props;
        const transformRef = React.useRef<HTMLDivElement>(null);
        const [position, setPosition] = React.useState<Position>({ top: 0, left: 0 });
        const [windowSize, setWindowSize] = React.useState<Position>({ top: window.innerHeight, left: window.innerWidth });

        const handleResize = debounce(() => {
            setPosition({
                top: position.top - (windowSize.top - window.innerHeight),
                left: position.left - (windowSize.left - window.innerWidth)
            });
            setWindowSize({ top: window.innerHeight, left: window.innerWidth })
        })

        React.useEffect(() => {
            if (anchorEvent && transformRef.current) {
                const anchorOffset = calculateAnchorOffset(anchorEvent, anchorOrigin || { vertical: "top", horizontal: "left" });
                const transformOffset = calculateTransformOffset(transformRef.current, transformOrigin || { vertical: "top", horizontal: "left" });
    
                setPosition({
                    top: anchorEvent?.getBoundingClientRect().top + (anchorOffset.top + transformOffset.top),
                    left: anchorEvent?.getBoundingClientRect().left + (anchorOffset.left + transformOffset.left)
                })
            }
        }, [anchorEvent, transformRef, anchorOrigin, transformOrigin])
    
        React.useEffect(() => {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            }
        }, [handleResize]);

        let PopoverElement = (
            <StyledPopover
                ref={transformRef}
                top={position.top}
                left={position.left}
                style={{ visibility: transformRef.current ? "visible" : "hidden" }}
                sx={sx}
            >
                {children}
            </StyledPopover>
        );

        if (handleClose) {
            PopoverElement = (
                <ClickAwayListener anchorEl={anchorEvent} onClickAway={handleClose}>
                    {PopoverElement}
                </ClickAwayListener>
            )
        }
    
        return (
            <div id={id}>
                {open &&
                    createPortal(
                        PopoverElement,
                        document.body
                    )
                }
            </div>
        );
    }
