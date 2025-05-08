/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";

import { useIONodesStyles } from "../../../../components/styles";

interface SubMappingSeparatorProps {
    isOnRootView: boolean;
    onClickAddSubMapping: () => void;
    isLastItem?: boolean;
};

const fadeInZoomIn = keyframes`
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
`;

const zoomIn = keyframes`
    0% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1.2);
    }
`;

const HoverButton = styled(Button)`
    animation: ${fadeInZoomIn} 0.2s ease-out forwards;
    &:hover {
        animation: ${zoomIn} 0.2s ease-out forwards;
    };
`;

export function SubMappingSeparator(props: SubMappingSeparatorProps) {
    const { isOnRootView, onClickAddSubMapping, isLastItem } = props;
    const classes = useIONodesStyles();
    const [isHoveredSeperator, setIsHoveredSeperator] = useState(false);

    const handleMouseEnter = () => {
        setIsHoveredSeperator(true);
    };

    const handleMouseLeave = () => {
        setIsHoveredSeperator(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={classes.subMappingItemSeparator}
        >
            {isHoveredSeperator && !isLastItem && isOnRootView && (
                <HoverButton
                    appearance="icon"
                    tooltip="Add another sub mapping here"
                    className={classes.addAnotherSubMappingButton}
                    onClick={onClickAddSubMapping}
                >
                    <Codicon name="add" iconSx={{ fontSize: 10 }} />
                </HoverButton>
            )}
        </div>
    );
};
