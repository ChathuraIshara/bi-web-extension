/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { FlowNode, Branch, LinePosition } from "../../utils/types";
import { useDiagramContext } from "../DiagramContext";
import styled from "@emotion/styled";
import { NODE_PADDING, POPUP_BOX_WIDTH } from "../../resources/constants";
import { Button, PromptTextField, ThemeColors } from "@wso2-enterprise/ui-toolkit";

export namespace PopupStyles {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: ${POPUP_BOX_WIDTH}px;
        padding: ${NODE_PADDING / 2}px ${NODE_PADDING}px;
        border-radius: 4px;
        background-color: ${ThemeColors.SURFACE};
        color: ${ThemeColors.ON_SURFACE};
    `;

    export const Row = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 4px;
        width: 100%;
    `;

    export const InfoText = styled.div`
        font-size: 11px;
        font-family: monospace;
        color: ${ThemeColors.ON_SURFACE};
        opacity: 0.7;
    `;
}

interface AddPromptPopupProps {
    node: FlowNode | Branch;
    target: LinePosition;
    onClose: () => void;
}

export function AddPromptPopup(props: AddPromptPopupProps) {
    const { node, target, onClose } = props;
    const { onAddNodePrompt, suggestions } = useDiagramContext();

    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [prompt]);

    const handleAddPrompt = () => {
        if (!target) {
            console.error(">>> AddPromptPopup: AddPromptPopup: target not found");
            return;
        }
        onAddNodePrompt(node, { startLine: target, endLine: target }, prompt);
    };

    const handleOnPromptChange = (value: string) => {
        setPrompt(value);
    };

    return (
        <PopupStyles.Container>
            <PromptTextField
                placeholder="Enter a prompt to generate next node"
                value={prompt}
                onTextChange={handleOnPromptChange}
                onEnter={handleAddPrompt}
                sx={{ width: "100%" }}
                readOnly={suggestions?.fetching}
            />

            <PopupStyles.Row>
                <PopupStyles.InfoText>Press ESC to cancel.</PopupStyles.InfoText>
                <Button
                    onClick={handleAddPrompt}
                    buttonSx={{
                        height: 18,
                        marginBottom: 2,
                    }}
                    
                    disabled={suggestions?.fetching}
                >
                    Generate
                </Button>
            </PopupStyles.Row>
        </PopupStyles.Container>
    );
}

export default AddPromptPopup;
