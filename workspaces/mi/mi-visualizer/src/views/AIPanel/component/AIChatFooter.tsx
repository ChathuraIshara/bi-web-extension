/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState, useRef, useEffect } from "react";
import { FlexRow, Footer, StyledTransParentButton, RippleLoader, FlexColumn } from "../styles";
import { Codicon } from "@wso2-enterprise/ui-toolkit";
import SuggestionsList from "./SuggestionsList";
import { useMICopilotContext } from "./MICopilotContext";
import { handleFileAttach } from "../utils";
import { USER_INPUT_PLACEHOLDER_MESSAGE, VALID_FILE_TYPES } from "../constants";
import { generateSuggestions, generateId, getBackendUrlAndView, fetchCodeGenerationsWithRetry } from "../utils";
import { Role, MessageType, CopilotChatEntry, BackendRequestType } from "../types";
import Attachments from "./Attachments";

/**
 * Footer component containing chat input and controls
 */
const AIChatFooter: React.FC = () => {
    const {
        backendUri,
        rpcClient,
        setMessages,
        copilotChat,
        setCopilotChat,
        codeBlocks,
        setCodeBlocks,
        currentUserPrompt,
        setCurrentUserprompt,
        backendRequestTriggered,
        setBackendRequestTriggered,
        isInitialPromptLoaded,
        setIsInitialPromptLoaded,
        isRuntimeVersionThresholdReached,
        questions,
        files,
        setFiles,
        images,
        setImages,
        controller,
        resetController,
        setRemainingTokenPercentage,
    } = useMICopilotContext();

    const [fileUploadStatus, setFileUploadStatus] = useState({ type: "", text: "" });
    const isStopButtonClicked = useRef(false);
    const isResponseReceived = useRef(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const placeholderString = USER_INPUT_PLACEHOLDER_MESSAGE;
    const [placeholder, setPlaceholder] = useState(placeholderString);
    const [charIndex, setCharIndex] = useState(0);
    const [showDots, setShowDots] = useState(false);

    // Handle text input keydown events
    const handleTextKeydown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (currentUserPrompt.trim() !== "") {
                handleSend();
            }
        }
    };

    // Handle stopping the response generation
    const handleStop = async () => {
        isStopButtonClicked.current = true;

        // Abort the fetch
        controller.abort();

        // Create a new AbortController for future fetches
        resetController();

        // Remove the last user and copilot messages
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages.pop(); // Remove the last user message
            newMessages.pop(); // Remove the last copilot message
            return newMessages;
        });

        // Generate suggestions based on chat history
        await generateSuggestions(backendUri, copilotChat, rpcClient, new AbortController()).then((response) => {
            setMessages((prevMessages) => [...prevMessages, ...response]);
        });

        // Explicitly adjust the textarea height after suggestion generation
        if (textAreaRef.current) {
            setTimeout(() => {
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            }, 0);
        }
        isStopButtonClicked.current = false;
    };

    // File handling
    const removeAllFiles = () => {
        setFiles([]);
        setFileUploadStatus({ type: "", text: "" });
    };

    const removeAllImages = () => {
        setImages([]);
        setFileUploadStatus({ type: "", text: "" });
    };

    async function handleSend(requestType: BackendRequestType = BackendRequestType.UserPrompt, prompt?: string | "") {
        // Block empty user inputs and avoid state conflicts
        if (currentUserPrompt === "" && !Object.values(BackendRequestType).includes(requestType)) {
            return;
        } else {
            // Remove all messages marked as label or questions from history before a backend call
            setMessages((prevMessages) =>
                prevMessages.filter(
                    (message) => message.type !== MessageType.Label && message.type !== MessageType.Question
                )
            );
            setBackendRequestTriggered(true);
            isResponseReceived.current = false;
        }

        // Variable to hold Assistant response
        let assistant_response = "";

        // Add the current user prompt to the chats based on the request type
        let currentCopilotChat: CopilotChatEntry[] = [...copilotChat];
        const chatId = generateId();
        const updateChats = (userPrompt: string, userMessageType?: MessageType) => {
            // Append labels to the user prompt
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: chatId, role: Role.MIUser, content: userPrompt, type: userMessageType, files, images },
                {
                    id: chatId,
                    role: Role.MICopilot,
                    content: assistant_response,
                    type: MessageType.AssistantMessage,
                },
            ]);

            let currentUserChat: CopilotChatEntry = {
                id: chatId,
                role: Role.CopilotUser,
                content: userPrompt,
            };
            setCopilotChat((prevMessages) => [...prevMessages, currentUserChat]);
            currentCopilotChat.push(currentUserChat);
        };

        switch (requestType) {
            case BackendRequestType.InitialPrompt:
                updateChats(currentUserPrompt, MessageType.InitialPrompt);
                break;
            case BackendRequestType.QuestionClick:
                prompt = prompt.replace(/^\d+\.\s/, "");
                updateChats(prompt, MessageType.UserMessage);
                setCurrentUserprompt(prompt);
                break;
            default:
                updateChats(currentUserPrompt, MessageType.UserMessage);
                break;
        }

        const { backendUrl, view } = await getBackendUrlAndView(rpcClient);
        const url = backendUri + backendUrl;

        try {
            const response = await fetchCodeGenerationsWithRetry(
                url,
                isRuntimeVersionThresholdReached,
                currentCopilotChat,
                files,
                images,
                rpcClient,
                controller,
                view
            );

            // Remove the user uploaded files and images after sending them to the backend
            removeAllFiles();
            removeAllImages();

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let result = "";

            // process the response stream from backend
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                result += chunk;

                const lines = result.split("\n");
                for (let i = 0; i < lines.length - 1; i++) {
                    try {
                        const json = JSON.parse(lines[i]);

                        // Update token usage information
                        const tokenUsage = json.usage;
                        const maxTokens = tokenUsage.max_usage;

                        if (maxTokens == -1) {
                            setRemainingTokenPercentage(-1);
                        } else {
                            const remainingTokens = tokenUsage.remaining_tokens;
                            let percentage = Math.round((remainingTokens / maxTokens) * 100);

                            if (percentage < 0) percentage = 0;

                            setRemainingTokenPercentage(percentage);
                        }

                        if (json.content == null) {
                            // End of the MI copilot response reached
                            // Add backend response to copilot chat
                            setCopilotChat((prevCopilotChat) => [
                                ...prevCopilotChat,
                                { id: chatId, role: Role.CopilotAssistant, content: assistant_response },
                            ]);

                            const questions = json.questions.map((question: string) => {
                                return {
                                    id: chatId,
                                    role: Role.default,
                                    content: question,
                                    type: MessageType.Question,
                                };
                            });
                            setMessages((prevMessages) => [...prevMessages, ...questions]);
                        } else {
                            assistant_response += json.content;

                            // Update the last assistance message with the new content
                            setMessages((prevMessages) => {
                                const newMessages = [...prevMessages];
                                newMessages[newMessages.length - 1].content += json.content;
                                return newMessages;
                            });

                            // Extract code blocks
                            const regex = /```[\s\S]*?```/g;
                            let match;
                            const newCodeBlocks = [...codeBlocks];

                            while ((match = regex.exec(assistant_response)) !== null) {
                                if (!newCodeBlocks.includes(match[0])) {
                                    newCodeBlocks.push(match[0]);
                                }
                            }

                            setCodeBlocks(newCodeBlocks);
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }

                result = lines[lines.length - 1];
                isResponseReceived.current = true;
            }

            if (result) {
                try {
                    const json = JSON.parse(result);
                    // Handle final result if needed
                    return json;
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        } catch (error) {
            if (!isStopButtonClicked) {
                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1].content += "Network error. Please check your connectivity.";
                    newMessages[newMessages.length - 1].type = MessageType.Error;
                    return newMessages;
                });
                console.error("Network error:", error);
            }
        } finally {
            if (!isStopButtonClicked.current) {
                setCurrentUserprompt("");
            }
            setBackendRequestTriggered(false);
        }
    }

    useEffect(() => {
        if (isInitialPromptLoaded) {
            handleSend(BackendRequestType.InitialPrompt);
            setIsInitialPromptLoaded(false);
            rpcClient.getMiDiagramRpcClient().executeCommand({ commands: ["MI.clearAIPrompt"] });
        }
    }, [isInitialPromptLoaded]);

    // Auto-resize the textarea based on content
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [currentUserPrompt]);

    // Handle placeholder animation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (charIndex < placeholderString.length) {
                setPlaceholder(placeholderString.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [charIndex]);

    // Handle dots animation for placeholder
    useEffect(() => {
        if (showDots) {
            const dotsTimer = setInterval(() => {
                setPlaceholder((prev) => (prev.endsWith("...") ? placeholderString : prev + "."));
            }, 500);
            return () => clearInterval(dotsTimer);
        }
    }, [showDots]);

    // Reset placeholder when focus is lost
    useEffect(() => {
        if (!isFocused) {
            setPlaceholder(placeholderString);
            setCharIndex(placeholderString.length);
        }
    }, [isFocused]);

    // Clear file upload status after 5 seconds
    useEffect(() => {
        if (fileUploadStatus.text) {
            const timer = setTimeout(() => {
                setFileUploadStatus({ type: "", text: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [fileUploadStatus]);

    return (
        <Footer>
            <FlexColumn
                style={{
                    border: isFocused ? "1px solid var(--vscode-focusBorder)" : "none",
                    backgroundColor: isDarkMode
                        ? "var(--vscode-list-hoverBackground)"
                        : "var(--vscode-editorHoverWidget-background)",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                tabIndex={0}
            >
                {backendRequestTriggered ? (
                    <FlexRow style={{ alignItems: "center", justifyContent: "center", width: "100%", padding: "10px" }}>
                        <span style={{ marginLeft: "10px" }}>
                            {isResponseReceived.current ? "Generating ": "Thinking "}
                        </span>
                        <RippleLoader>
                            <div className="ldio">
                                <div></div>
                                <div></div>
                            </div>
                        </RippleLoader>
                    </FlexRow>
                ) : (
                    <>
                        {currentUserPrompt.trim() === "" && (
                            <FlexRow style={{ flexWrap: "wrap", gap: "5px", marginBottom: "5px" }}>
                            <SuggestionsList
                                questionMessages={questions}
                                handleQuestionClick={(content: string) =>
                                    handleSend(BackendRequestType.QuestionClick, content)
                                }
                            />
                        </FlexRow>
                        ) }
                        <FlexRow style={{ alignItems: "center", width: "100%", position: "relative" }}>
                            <textarea
                                ref={textAreaRef}
                                value={currentUserPrompt}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    setCurrentUserprompt(e.target.value);
                                    setShowDots(false);
                                }}
                                onFocus={() => {
                                    setShowDots(true);
                                    setIsFocused(true);
                                }}
                                onBlur={() => {
                                    setShowDots(false);
                                    setIsFocused(false);
                                }}
                                onKeyDown={handleTextKeydown}
                                placeholder={placeholder}
                                style={{
                                    flex: 1,
                                    overflowY: "auto", 
                                    padding: "5px 15px 5px 10px",
                                    borderRadius: "4px",
                                    border: "none",
                                    resize: "none",
                                    outline: "none",
                                    maxHeight: "100px", // Limit height to approximately 5 lines
                                    backgroundColor: isDarkMode
                                        ? "var(--vscode-list-hoverBackground)"
                                        : "var(--vscode-editorHoverWidget-background)",
                                    color: "var(--vscode-input-foreground)",
                                    position: "relative",
                                }}
                                rows={2}
                            />
                            {currentUserPrompt.trim() !== "" && (<StyledTransParentButton
                                    onClick={() => setCurrentUserprompt("")}
                                    style={{
                                        width: "20px",
                                        position: "absolute",
                                        right: "2px",
                                        top: "2px",
                                        color: isDarkMode
                                            ? "var(--vscode-input-foreground)"
                                            : "var(--vscode-editor-foreground)",
                                    }}
                                >
                                    <Codicon name="clear-all" />
                                </StyledTransParentButton>
                        )}
                        </FlexRow>
                        <FlexRow style={{ flexWrap: "wrap", gap: "2px", alignItems: "center", marginTop: "10px" }}>
                            {files.length > 0 && !isInitialPromptLoaded ? (
                                <Attachments
                                    attachments={files}
                                    nameAttribute="name"
                                    addControls={true}
                                    setAttachments={setFiles}
                                />
                            ) : null}
                            {images.length > 0 && !isInitialPromptLoaded ? (
                                <Attachments
                                    attachments={images}
                                    nameAttribute="imageName"
                                    addControls={true}
                                    setAttachments={setImages}
                                />
                            ) : null}
                        </FlexRow>
                    </>
                )}
                <FlexRow style={{ justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <StyledTransParentButton
                            onClick={() => document.getElementById("fileInput")?.click()}
                            style={{
                                width: "30px",
                                color: isDarkMode
                                    ? "var(--vscode-input-foreground)"
                                    : "var(--vscode-editor-foreground)",
                            }}
                        >
                            <Codicon name="new-file" />
                        </StyledTransParentButton>
                        {fileUploadStatus.text && fileUploadStatus.type === "error" && (
                            <span
                                style={{
                                    marginLeft: "5px",
                                    color: "var(--vscode-errorForeground)",
                                }}
                            >
                                {fileUploadStatus.text}
                            </span>
                        )}
                    </div>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        multiple
                        accept={[...VALID_FILE_TYPES.files, ...VALID_FILE_TYPES.images].join(",")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFileAttach(e, files, setFiles, images, setImages, setFileUploadStatus)
                        }
                        disabled={backendRequestTriggered}
                    />
                    <StyledTransParentButton
                        onClick={() => (backendRequestTriggered ? handleStop() : handleSend())}
                        style={{
                            width: "30px",
                            color: isDarkMode ? "var(--vscode-input-foreground)" : "var(--vscode-editor-foreground)",
                        }}
                        disabled={currentUserPrompt.trim() === "" && !backendRequestTriggered}
                    >
                        <span
                            className={`codicon ${backendRequestTriggered ? "codicon-stop-circle" : "codicon-send"}`}
                        />
                    </StyledTransParentButton>
                </FlexRow>
            </FlexColumn>
        </Footer>
    );
};

export default AIChatFooter;
