/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RefObject, MouseEvent } from "react";
import styled from "@emotion/styled";
import { Suggestion } from "./hooks/useCommands";

/**
 * Styles for the overall suggestions list container.
 */
const SuggestionsListContainer = styled.ul`
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: var(--vscode-dropdown-listBackground);
    border: 1px solid var(--vscode-editorWidget-border);
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 4px 0 0 0;
    max-height: 150px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    z-index: 1000;
`;

/**
 * Props to indicate whether this suggestion is currently active/selected.
 */
interface SuggestionItemProps {
    active: boolean;
}

const SuggestionItem = styled.li<SuggestionItemProps>`
    padding: 6px 12px;
    cursor: pointer;
    background-color: ${(props: SuggestionItemProps) =>
        props.active ? "var(--vscode-editorActionList-focusBackground)" : "var(--vscode-editorActionList-background)"};
    color: ${(props: SuggestionItemProps) =>
        props.active ? "var(--vscode-editorActionList-focusForeground)" : "var(--vscode-editorActionList-foreground)"};

    &:hover {
        background-color: ${(props: SuggestionItemProps) =>
            props.active ? "var(--vscode-editorActionList-focusBackground)" : "var(--vscode-list-hoverBackground)"};
    }
`;

interface SuggestionsListProps {
    suggestions: Suggestion[];
    activeSuggestionIndex: number;
    activeSuggestionRef: RefObject<HTMLLIElement | null>;
    onSuggestionClick: (suggestion: Suggestion) => void;
    onSuggestionMouseDown: (e: MouseEvent) => void;
}

/**
 * A small presentational component for rendering suggestions below the input.
 */
const SuggestionsList: React.FC<SuggestionsListProps> = ({
    suggestions,
    activeSuggestionIndex,
    activeSuggestionRef,
    onSuggestionClick,
    onSuggestionMouseDown,
}) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <SuggestionsListContainer role="listbox">
            {suggestions.map((suggestion, index) => {
                const isActive = index === activeSuggestionIndex;
                return (
                    <SuggestionItem
                        key={suggestion.text + index}
                        ref={isActive ? activeSuggestionRef : null}
                        active={isActive}
                        onClick={() => onSuggestionClick(suggestion)}
                        onMouseDown={onSuggestionMouseDown}
                        role="option"
                        aria-selected={isActive}
                    >
                        {suggestion.text}
                    </SuggestionItem>
                );
            })}
        </SuggestionsListContainer>
    );
};

export default SuggestionsList;
