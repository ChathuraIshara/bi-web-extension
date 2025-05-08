/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { debounce } from 'lodash';
import React, { CSSProperties, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Range } from 'vscode-languageserver-types';
import styled from '@emotion/styled';
import { HelperPaneCompletionItem, HelperPaneFunctionInfo, FormExpressionFieldValue } from '@wso2-enterprise/mi-core';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import {
    Button,
    Codicon,
    CompletionItem,
    ErrorBanner,
    FormExpressionEditor,
    FormExpressionEditorRef,
    RequiredFormInput,
    TextField,
    Typography,
} from '@wso2-enterprise/ui-toolkit';
import { getHelperPane } from '../HelperPane';
import {
    enrichExpressionValue,
    extractExpressionValue,
    filterHelperPaneCompletionItems,
    filterHelperPaneFunctionCompletionItems,
    formatExpression,
    getExpressionValue,
    modifyCompletion
} from './utils';
import { Colors } from '../../../resources/constants';

type EXProps = {
    isActive: boolean;
}

type StyleProps = {
    sx?: CSSProperties;
}

/**
 * Props for ExpressionEditor
 * @param labelAdornment - The label adornment to display
 * @param id - The id of the expression field
 * @param disabled - Whether the expression field is disabled
 * @param label - The label of the expression
 * @param required - Whether the expression is required
 * @param value - The value of the expression
 * @param placeholder - The placeholder of the expression
 * @param nodeRange - The range of the node with the expression
 * @param canChange - Whether the expression mode can be toggled
 * @param onChange - Callback function to be called when the expression changes
 * @param onFocus - Callback function to be called when the expression is focused
 * @param onBlur - Callback function to be called when the expression is blurred
 * @param onCancel - Callback function to be called when the completions dropdown is closed
 * @param openExpressionEditor - Callback function to be called when the expression editor is opened
 * @param errorMsg - The error message to display
 * @param sx - The style to apply to the container
 */
type FormExpressionFieldProps = {
    labelAdornment?: ReactNode;
    id?: string;
    disabled?: boolean;
    label: string;
    required?: boolean;
    value: FormExpressionFieldValue;
    placeholder: string;
    nodeRange: Range;
    canChange: boolean;
    supportsAIValues?: boolean;
    onChange: (value: FormExpressionFieldValue) => void;
    onFocus?: (e?: any) => void | Promise<void>;
    onBlur?: (e?: any) => void | Promise<void>;
    onCancel?: () => void;
    openExpressionEditor: (value: FormExpressionFieldValue, setValue: (value: FormExpressionFieldValue) => void) => void;
    errorMsg: string;
    sx?: CSSProperties;
};

export namespace S {
    export const Container = styled.div<StyleProps>(({ sx }: StyleProps) => ({
        width: '100%',
        fontFamily: 'var(--font-family)',
        ...sx
    }));

    export const Header = styled.div({
        display: 'flex',
    });

    export const Label = styled.label({
        color: 'var(--vscode-editor-foreground)',
        textTransform: 'capitalize',
    });

    export const AdornmentContainer = styled.div({
        marginTop: '3.75px',
        marginBottom: '2.5px',
        width: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--vscode-inputOption-activeBackground)'
    })

    export const EX = styled.div<EXProps>(({ isActive }: EXProps) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        border: '1px solid transparent',
        cursor: 'pointer',

        '&:hover': {
            backgroundColor: 'var(--vscode-inputOption-activeBackground)'
        },

        ...(isActive && {
            backgroundColor: 'var(--vscode-inputOption-activeBackground)',
            borderColor: 'var(--vscode-inputOption-activeBorder)'
        }),
    }));

    export const EXText = styled(Typography)<EXProps>(({ isActive }: EXProps) => ({
        color: isActive ? 'var(--focus-border)' : 'inherit',
    }));
}

/**
 * The FormExpressionField component for MI forms.
 * This component should be used with a Controller when using react-hook-forms.
 */
export const FormExpressionField = (params: FormExpressionFieldProps) => {
    const {
        labelAdornment,
        id,
        disabled,
        label,
        required,
        value,
        placeholder,
        nodeRange,
        canChange,
        supportsAIValues,
        onChange,
        onCancel,
        errorMsg,
        onFocus,
        onBlur,
        openExpressionEditor,
        sx
    } = params;

    const { rpcClient } = useVisualizerContext();

    const expressionRef = useRef<FormExpressionEditorRef>(null);
    const cursorPositionRef = useRef<number>(null);
    const [completions, setCompletions] = useState<CompletionItem[]>([]);
    const [isHelperPaneOpen, setIsHelperPaneOpen] = useState<boolean>(false);
    const [isLoadingHelperPaneInfo, setIsLoadingHelperPaneInfo] = useState<boolean>(false);
    const [isExActive, setIsExActive] = useState<boolean>(false);
    const [payloadInfo, setPayloadInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [variableInfo, setVariableInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [propertiesInfo, setPropertiesInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [functionInfo, setFunctionInfo] = useState<HelperPaneFunctionInfo>(null);
    const [configInfo, setConfigInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [headerInfo, setHeaderInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [paramInfo, setParamInfo] = useState<HelperPaneCompletionItem[]>(null);
    const [isAIFill, setIsAIFill] = useState<boolean>(value.fromAI);

    const debouncedRetrieveCompletions = useCallback(
        async (expression: string, cursorPosition: number) => {
            const machineView = await rpcClient.getVisualizerState();
            let position = nodeRange.start == nodeRange.end ? nodeRange.start :
                { line: nodeRange.start.line, character: nodeRange.start.character + 1 };
            const completions = await rpcClient.getMiDiagramRpcClient().getExpressionCompletions({
                documentUri: machineView.documentUri,
                expression: expression,
                position: position,
                offset: cursorPosition,
            });
            const modifiedCompletions =
                completions?.items
                    .map((completion: any) => modifyCompletion(completion))
                    .sort((a, b) => a.sortText.localeCompare(b.sortText)) ?? [];
            setCompletions(modifiedCompletions);
        },
        [rpcClient]
    );

    const retrieveCompletions = useCallback(debounce(debouncedRetrieveCompletions, 300), [
        debouncedRetrieveCompletions,
    ]);

    const handleExpressionChange = async (expression: string, updatedCursorPosition: number) => {
        onChange({
            ...value,
            value: value.isExpression ? enrichExpressionValue(expression) : expression
        });
        cursorPositionRef.current = updatedCursorPosition;

        // Only retrieve completions if the value is an expression
        if (value.isExpression) {
            retrieveCompletions(expression, updatedCursorPosition);
        }
    };

    const handleCancel = () => {
        retrieveCompletions.cancel();
        setCompletions([]);

        onCancel?.();
    };

    const handleFocus = async () => {
        await onFocus?.();
    };

    const handleBlur = async () => {
        await onBlur?.();

        handleCancel();
    };

    const getHelperPaneInfo = useCallback(debounce((type: string, filterText: string) => {
        rpcClient.getVisualizerState().then((machineView) => {
            let position = nodeRange ? (nodeRange?.start == nodeRange?.end ? nodeRange.start :
                { line: nodeRange.start.line, character: nodeRange.start.character + 1 }) : undefined;
            rpcClient
                .getMiDiagramRpcClient()
                .getHelperPaneInfo({
                    documentUri: machineView.documentUri,
                    position: position,
                })
                .then((response) => {
                    switch (type) {
                        case 'payload':
                            setPayloadInfo(filterHelperPaneCompletionItems(response.payload, filterText));
                            break;
                        case 'variables':
                            setVariableInfo(filterHelperPaneCompletionItems(response.variables, filterText));
                            break;
                        case 'properties':
                            setPropertiesInfo(filterHelperPaneCompletionItems(response.properties, filterText));
                            break;
                        case 'functions':
                            setFunctionInfo(filterHelperPaneFunctionCompletionItems(response.functions, filterText));
                            break;
                        case 'configs':
                            setConfigInfo(filterHelperPaneCompletionItems(response.configs, filterText));
                            break;
                        case 'headers':
                            setHeaderInfo(filterHelperPaneCompletionItems(response.headers, filterText));
                            break;
                        case 'params':
                            setParamInfo(filterHelperPaneCompletionItems(response.params, filterText));
                            break;
                    }
                })
                .finally(() => {
                    setIsLoadingHelperPaneInfo(false);
                });
        });
    }, 300),
        [rpcClient, nodeRange?.start]
    );

    const handleGetHelperPaneInfo = useCallback((type: string, filterText: string) => {
        setIsLoadingHelperPaneInfo(true);
        getHelperPaneInfo(type, filterText);
    }, [getHelperPaneInfo]);

    const handleChangeHelperPaneState = (isOpen: boolean) => {
        setIsHelperPaneOpen(isOpen);
    }

    const handleGetHelperPane = useCallback((currentValue: string, onChange: (value: string, updatedCursorPosition: number) => void) => {
        const handleHelperPaneChange = (value: string) => {
            const cursorPosition = expressionRef.current?.shadowRoot?.querySelector('textarea')?.selectionStart;
            const updatedValue = currentValue.slice(0, cursorPosition) + value + currentValue.slice(cursorPosition);
            const updatedCursorPosition = cursorPosition + value.length;

            // Update the value in the expression editor
            onChange(updatedValue, updatedCursorPosition);
            // Focus the expression editor
            expressionRef.current?.focus();
            // Set the cursor
            expressionRef.current?.setCursor(updatedValue, updatedCursorPosition);
            // Close the helper pane
            handleChangeHelperPaneState(false);
        };

        const position = nodeRange ?
            nodeRange?.start == nodeRange?.end
                ? nodeRange.start
                : { line: nodeRange.start.line, character: nodeRange.start.character + 1 } : undefined;

        return getHelperPane(
            position,
            'default',
            () => handleChangeHelperPaneState(false),
            handleHelperPaneChange
        );
    }, [expressionRef.current, handleChangeHelperPaneState, nodeRange, getHelperPane]);

    const handleFunctionEdit = (functionName: string) => {
        // Open Expression Editor for xpath
        if (functionName === 'xpath') {
            setIsExActive(true);
        } else {
            setIsExActive(false);
        }
    }

    const handleGetExpressionEditorIcon = () => {
        const handleClick = () => {
            if (canChange) {
                onChange({
                    ...value,
                    isExpression: !value.isExpression,
                    value: getExpressionValue(value.value, !value.isExpression)
                });
            }
        }

        return (
            <S.EX isActive={value.isExpression} onClick={handleClick}>
                <S.EXText variant='h6' sx={{ margin: 0 }} isActive={value.isExpression}>EX</S.EXText>
            </S.EX>
        );
    }

    const handleExpressionEditorChange = useCallback((expressionField: FormExpressionFieldValue) => {
        onChange({
            ...expressionField,
            value: expressionField.isExpression ? enrichExpressionValue(expressionField.value) : expressionField.value
        });
        cursorPositionRef.current = expressionField.value?.length ?? 0;
    }, [onChange, enrichExpressionValue]);

    const handleOpenExpressionEditor = useCallback(() => {
        const extractedExpressionValue = extractExpressionValue(value.value);
        const newValue = {
            ...value,
            value: extractedExpressionValue
        }

        openExpressionEditor(newValue, handleExpressionEditorChange);
    }, [value, openExpressionEditor, handleExpressionEditorChange]);

    const handleAIFill = () => {
        onChange({
            ...value,
            fromAI: !isAIFill
        });
        setIsAIFill(!isAIFill);
    };

    const actionButtons = useMemo(() => {
        if (!value.isExpression) {
            return [];
        }

        return [
            ...(isExActive
                ? [
                    {
                        tooltip: 'Open Expression Editor',
                        iconType: 'codicon' as any,
                        name: 'edit',
                        onClick: handleOpenExpressionEditor
                    }
                ]
                : []),
            ...(value.isExpression
                ? [
                    {
                        tooltip: 'Open Helper Pane',
                        iconType: 'icon' as any,
                        name: 'open-helper-pane',
                        onClick: () => {
                            expressionRef.current?.focus();
                            handleChangeHelperPaneState(!isHelperPaneOpen);
                        }
                    }
                ]
                : [])
        ];
    }, [
        isExActive,
        isHelperPaneOpen,
        value,
        expressionRef.current,
        handleChangeHelperPaneState,
        openExpressionEditor,
        onChange
    ]);

    const expressionValue = useMemo(() => {
        const extractedExpressionValue = extractExpressionValue(value.value);
        const formattedExpressionValue = formatExpression(extractedExpressionValue);
        return isAIFill ? undefined : formattedExpressionValue;
    }, [value.value, extractExpressionValue]);

    return (
        <S.Container id={id} sx={sx}>
            <S.Header>
                <S.Label>{label}</S.Label>
                {required && <RequiredFormInput />}
                {labelAdornment}
            </S.Header>
            <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!isAIFill && <FormExpressionEditor
                        ref={expressionRef}
                        disabled={disabled}
                        value={expressionValue}
                        placeholder={placeholder}
                        onChange={handleExpressionChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onCancel={handleCancel}
                        getExpressionEditorIcon={handleGetExpressionEditorIcon}
                        helperPaneOrigin='left'
                        actionButtons={actionButtons}
                        {...(value.isExpression && {
                            completions,
                            isHelperPaneOpen,
                            changeHelperPaneState: handleChangeHelperPaneState,
                            getHelperPane: handleGetHelperPane,
                            onFunctionEdit: handleFunctionEdit,
                            startAdornment: (
                                <S.AdornmentContainer>
                                    <Typography variant="h4" sx={{ margin: 0 }}>
                                        {"${"}
                                    </Typography>
                                </S.AdornmentContainer>
                            ),
                            endAdornment: (
                                <S.AdornmentContainer>
                                    <Typography variant="h4" sx={{ margin: 0 }}>
                                        {"}"}
                                    </Typography>
                                </S.AdornmentContainer>
                            ),
                        })}
                    />}

                    {isAIFill && (
                        <div style={{ width: '100%' }}>
                            <div style={{
                                color: Colors.ON_SURFACE,
                                padding: '5px',
                                backgroundColor: 'var(--vscode-inputOption-activeBackground)',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Typography variant='body2'>AI decides based on description</Typography>
                                {(value.description?.defaultValue !== value.description?.currentValue) && <Button
                                    tooltip={"Reset to default description"}
                                    onClick={() => {
                                        onChange({
                                            ...value,
                                            description: {
                                                ...value.description,
                                                currentValue: value.description.defaultValue
                                            }
                                        });
                                    }}
                                    appearance="icon"
                                    sx={{
                                        marginLeft: '5px',
                                        'vscode-button:hover': {
                                            backgroundColor: 'var(--button-primary-hover-background) !important'
                                        }
                                    }}
                                    buttonSx={{
                                        height: '16px',
                                        width: '22px',
                                        borderRadius: '2px',
                                        backgroundColor: 'var(--vscode-button-background)',
                                    }}
                                >
                                    <Codicon
                                        name={"debug-restart"}
                                        iconSx={{
                                            fontSize: '12px',
                                            color: 'var(--vscode-button-foreground)'
                                        }}
                                        sx={{ height: '14px', width: '16px' }}
                                    />
                                </Button>}
                            </div>
                            <TextField
                                value={value.description?.currentValue ?? value.description?.defaultValue}
                                onChange={(e) => {
                                    onChange({
                                        ...value,
                                        description: {
                                            ...value.description,
                                            currentValue: e.target.value
                                        }
                                    });
                                }}
                                placeholder={'Description'}
                                sx={{ width: '100%', backgroundColor: 'var(--vscode-input-background)' }}
                            />
                        </div>
                    )}

                    {supportsAIValues && <Button
                        tooltip={"Let AI fill this field"}
                        onClick={handleAIFill}
                        appearance="icon"
                        sx={{
                            marginLeft: '5px',
                        }}
                        buttonSx={{
                            height: '26px',
                            width: '22px',
                            borderRadius: '2px',
                            backgroundColor: isAIFill ? Colors.PRIMARY : Colors.SECONDARY_BUTTON,
                        }}
                    >
                        <Codicon
                            name={"wand"}
                            iconSx={{
                                fontSize: '12px',
                                color: Colors.ON_PRIMARY
                            }}
                            sx={{ height: '14px', width: '16px' }}
                        />
                    </Button>}
                </div>
                {errorMsg && <ErrorBanner errorMsg={errorMsg} />}
            </div>
        </S.Container>
    );
};
