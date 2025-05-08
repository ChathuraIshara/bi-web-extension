/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
import { FlexRow, Question } from "../styles";
import { Icon } from "@wso2-enterprise/ui-toolkit";

interface SuggestionsListProps {
    questionMessages: Array<{ role: string; content: string; type: string }>;
    handleQuestionClick: (content: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ questionMessages, handleQuestionClick }) => {
    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const getThemeColor = (lightColor: string, darkColor: string) => {
        return isDarkMode ? `var(--vscode-${darkColor})` : `var(--vscode-${lightColor})`;
    };

    return (
        <div style={{ transition: "opacity 0.3s ease-in-out" }}>
            {questionMessages.length === 0 ? (
                <Question
                    style={{
                        color: getThemeColor("textLink.foreground", "textLink.activeForeground"),
                        opacity: questionMessages.length === 0 ? 1 : 0,
                    }}
                >
                    <Icon
                        name="wand-magic-sparkles-solid"
                        sx={`marginRight:5px; color: ${getThemeColor(
                            "textLink.foreground",
                            "textLink.activeForeground"
                        )}`}
                    />
                    &nbsp;
                    <div>Loading suggestions ...</div>
                </Question>
            ) : (
                questionMessages.map((message, index) => (
                    <Question
                        key={index}
                        style={{
                            opacity: questionMessages.length > 0 ? 1 : 0,
                        }}
                    >
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleQuestionClick(message.content);
                            }}
                            style={{ textDecoration: "none" }}
                        >
                            <FlexRow>
                                <Icon name="wand-magic-sparkles-solid" sx="marginRight:5px" />
                                &nbsp;
                                <div>{message.content.replace(/^\d+\.\s/, "")}</div>
                            </FlexRow>
                        </a>
                    </Question>
                ))
            )}
        </div>
    );
};

export default SuggestionsList;
