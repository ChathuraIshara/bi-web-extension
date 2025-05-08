/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 *
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import styled from "@emotion/styled";
import { Codicon } from "@wso2-enterprise/ui-toolkit";
import { useState, useEffect } from "react";

export const PreviewContainerDefault = styled.div`
    font-size: 0.6em;
    padding: 2px 5px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
    right: 0;
    top: 10px;
    margin-right: -20px;
`;

export const PreviewContainer = styled.div`
    background-color: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-size: 0.8em; 
    padding: 2px 5px; 
    border-radius: 3px; 
    display: inline-block; 
    margin-left: 2px; 
`;

interface RoleContainerProps {
    icon: string;
    title: string;
    showPreview: boolean;
    isLoading: boolean;
}

const RoleContainer: React.FC<RoleContainerProps> = ({ icon, title, showPreview, isLoading }) => {
    const [generatingText, setGeneratingText] = useState("Generating.");

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setGeneratingText((prev) => {
                    if (prev === "Generating...") return "Generating.";
                    return prev + ".";
                });
            }, 500);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "6px" }}>
            <Codicon name={icon} />
            <h3 style={{ margin: 0 }}>{title}</h3>
            {showPreview && <PreviewContainer>Preview</PreviewContainer>}
            {isLoading && <span style={{ color: "var(--vscode-input-placeholderForeground)" }}>{generatingText}</span>}
        </div>
    );
};

export default RoleContainer;
