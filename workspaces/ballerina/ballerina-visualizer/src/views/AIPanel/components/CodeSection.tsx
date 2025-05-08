/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { CodeSegment, CodeSegmentProps } from "./CodeSegment";
import styled from "@emotion/styled";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import { Spinner } from "./ProgressTextSegment";
import { Collapse } from "react-collapse";
import { SegmentType, splitContent } from "./AIChat";

interface CodeSectionProps {
    codeSegments: CodeSegmentProps[];
    loading: boolean;
    isReady: boolean;
    handleAddAllCodeSegmentsToWorkspace: (
        codeSegment: any,
        setIsCodeAdded: React.Dispatch<React.SetStateAction<boolean>>,
        command: string
    ) => void;
    handleRevertChanges: (
        codeSegment: any,
        setIsCodeAdded: React.Dispatch<React.SetStateAction<boolean>>,
        command: string
    ) => void;
    message: { role: string; content: string; type: string };
    buttonsActive: boolean;
    isSyntaxError: boolean;
    command: string;
    diagnostics: any[];
    onRetryRepair: () => void;
    isPromptExecutedInCurrentWindow: boolean;
}

const EntryContainer = styled.div<{ hasErrors: boolean; isOpen: boolean; isHovered: boolean }>(
    ({ isOpen, isHovered }: { isOpen: boolean; isHovered: boolean }) => ({
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        cursor: "pointer",
        padding: "10px",
        borderRadius: isOpen ? "4px 4px 0 0" : "4px",
        backgroundColor: isHovered ? "var(--vscode-toolbar-hoverBackground)" : "var(--vscode-toolbar-activeBackground)",
    })
);

const CollapsibleContent = styled.div<{ isHovered: boolean }>(({ isHovered }: { isHovered: boolean }) => ({
    padding: "0 8px 8px 8px", // Padding for all sides except top
    display: "flex",
    flexDirection: "column",
    backgroundColor: isHovered ? "var(--vscode-toolbar-hoverBackground)" : "var(--vscode-toolbar-activeBackground)",
    borderRadius: "0 0 4px 4px",
}));

export const CodeSection: React.FC<CodeSectionProps> = ({
    codeSegments,
    loading,
    isReady,
    handleAddAllCodeSegmentsToWorkspace,
    handleRevertChanges,
    message,
    buttonsActive,
    isSyntaxError,
    command,
    diagnostics = [],
    onRetryRepair = () => {},
    isPromptExecutedInCurrentWindow,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCodeAdded, setIsCodeAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Shared hover state

    const language = "ballerina";
    const isTestCode = command === "test";
    const name = loading
        ? `Generating ${isTestCode ? "Tests..." : "Integration..."}`
        : isTestCode
        ? "Ballerina Tests"
        : "Ballerina Integration";

    const allCodeSegments = splitContent(message.content)
        .filter((segment) => segment.type === SegmentType.Code)
        .map((segment) => ({ segmentText: segment.text, filePath: segment.fileName }));

    const isRepairButtonVisible = () =>
        !loading && isReady && diagnostics.length > 0 && command === "code" && !isCodeAdded;

    return (
        <div>
            <EntryContainer
                hasErrors={isRepairButtonVisible()}
                isOpen={isOpen}
                isHovered={isHovered}
                onClick={() => !loading && setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={{ flex: 9, fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    {!loading &&
                        isReady &&
                        language === "ballerina" &&
                        (!isOpen ? <Codicon name="chevron-right" /> : <Codicon name="chevron-down" />)}
                    {loading && <Spinner className="codicon codicon-loading spin" role="img"></Spinner>}
                    {name}
                </div>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    {isRepairButtonVisible() && (
                        <Button
                            appearance="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRetryRepair();
                            }}
                            disabled={loading}
                            tooltip={`Click to auto-resolve errors of the generated integration with AI: \nErrors:\n${diagnostics
                                .map((d) => d.message)
                                .join("\n")}`}
                        >
                            <Codicon name="sync" />
                        </Button>
                    )}

                    {!loading &&
                        isReady &&
                        language === "ballerina" &&
                        (!isCodeAdded ? (
                            <Button
                                appearance="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAllCodeSegmentsToWorkspace(allCodeSegments, setIsCodeAdded, command);
                                }}
                                tooltip={
                                    isSyntaxError
                                        ? "Syntax issues detected in generated integration. Reattempt required"
                                        : !isPromptExecutedInCurrentWindow
                                            ? "Code was generated for different session, please regenerate again"
                                            : ""
                                }
                                disabled={!buttonsActive || isSyntaxError || !isPromptExecutedInCurrentWindow}
                            >
                                <Codicon name="add" />
                                &nbsp;&nbsp;Add to Integration
                            </Button>
                        ) : (
                            <Button
                                appearance="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRevertChanges(allCodeSegments, setIsCodeAdded, command);
                                }}
                                tooltip={
                                    !isPromptExecutedInCurrentWindow
                                        ? "Code was generated for different session, please regenerate again"
                                        : ""
                                }
                                disabled={!buttonsActive || !isPromptExecutedInCurrentWindow}
                            >
                                <Codicon name="history" />
                                &nbsp;&nbsp;Revert to Checkpoint
                            </Button>
                        ))}
                </div>
            </EntryContainer>
            <Collapse isOpened={isOpen}>
                <CollapsibleContent
                    isHovered={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {codeSegments.map((segment, index) => (
                        <CodeSegment
                            key={index}
                            source={segment.source}
                            fileName={segment.fileName}
                            language={segment.language}
                        />
                    ))}
                </CollapsibleContent>
            </Collapse>
        </div>
    );
};
