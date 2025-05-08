/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { debounce } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Control, Controller, FieldValues, UseFormWatch } from 'react-hook-form';
import styled from '@emotion/styled';
import {
    Button,
    CompletionItem,
    ErrorBanner,
    FormExpressionEditor,
    FormExpressionEditorRef,
    HelperPaneHeight,
    Icon,
    RequiredFormInput,
    ThemeColors,
    Tooltip
} from '@wso2-enterprise/ui-toolkit';
import { getPropertyFromFormField, sanitizeType } from './utils';
import { FormField, FormExpressionEditorProps } from '../Form/types';
import { useFormContext } from '../../context';
import {
    LineRange,
    RecordTypeField,
    SubPanel,
    SubPanelView,
    SubPanelViewProps
} from '@wso2-enterprise/ballerina-core';

export type ContextAwareExpressionEditorProps = {
    field: FormField;
    openSubPanel?: (subPanel: SubPanel) => void;
    subPanelView?: SubPanelView;
    handleOnFieldFocus?: (key: string) => void;
    autoFocus?: boolean;
    visualizable?: boolean;
    recordTypeField?: RecordTypeField;
};

type ExpressionEditorProps = ContextAwareExpressionEditorProps &
    FormExpressionEditorProps & {
        control: Control<FieldValues, any>;
        watch: UseFormWatch<any>;
        targetLineRange?: LineRange;
        fileName: string;
    };

export namespace S {
    export const Container = styled.div({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontFamily: 'var(--font-family)'
    });

    export const Ribbon = styled.div({
        backgroundColor: ThemeColors.PRIMARY,
        opacity: 0.6,
        width: '24px',
        height: `calc(100% - 6.5px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopLeftRadius: '2px',
        borderBottomLeftRadius: '2px',
        borderRight: 'none',
        marginTop: '3.75px',
        paddingTop: '6px',
        cursor: 'pointer'
    });

    export const TitleContainer = styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    export const LabelContainer = styled.div({
        display: 'flex',
        alignItems: 'center'
    });

    export const HeaderContainer = styled.div({
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    });

    export const Header = styled.div({
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    });

    export const Type = styled.div<{ isVisible: boolean }>(({ isVisible }) => ({
        color: ThemeColors.PRIMARY,
        fontFamily: 'monospace',
        fontSize: '12px',
        border: `1px solid ${ThemeColors.PRIMARY}`,
        borderRadius: '999px',
        padding: '2px 8px',
        display: 'inline-block',
        userSelect: 'none',
        maxWidth: '148px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        opacity: 0,
        animation: `${isVisible ? 'fadeIn' : 'fadeOut'} 0.2s ease-${isVisible ? 'in' : 'out'} forwards`,
        '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 }
        },
        '@keyframes fadeOut': {
            '0%': { opacity: 1 },
            '100%': { opacity: 0 }
        }
    }));

    export const Label = styled.label({
        color: 'var(--vscode-editor-foreground)',
        textTransform: 'capitalize'
    });

    export const Description = styled.div({
        color: 'var(--vscode-list-deemphasizedForeground)'
    });

    export const DataMapperBtnTxt = styled.p`
        font-size: 10px;
        margin: 0;
        color: var(--vscode-button-background);
    `;

    export const AddNewButton = styled(Button)`
        & > vscode-button {
            color: var(--vscode-textLink-activeForeground);
            border-radius: 0px;
            padding: 3px 5px;
            margin-top: 4px;
        }
        & > vscode-button > * {
            margin-right: 6px;
        }
    `;

    export const DefaultValue = styled.span`
        font-family: monospace;
        font-size: 12px;
    `;
}

const EditorRibbon = ({ onClick }: { onClick: () => void }) => {
    return (
        <Tooltip content="Add Expression" containerSx={{ cursor: 'default' }}>
            <S.Ribbon onClick={onClick}>
                <Icon name="bi-expression" sx={{ 
                    color: ThemeColors.ON_PRIMARY, 
                    fontSize: '12px', 
                    width: '12px', 
                    height: '12px'
                }} />
            </S.Ribbon>
        </Tooltip>
    );
};

export const ContextAwareExpressionEditor = forwardRef<FormExpressionEditorRef, ContextAwareExpressionEditorProps>(
    (props, ref) => {
        const { form, expressionEditor, targetLineRange, fileName } = useFormContext();

        return (
            <ExpressionEditor
                ref={ref}
                fileName={fileName}
                {...targetLineRange}
                {...props}
                {...form}
                {...expressionEditor}
            />
        );
    }
);

export const ExpressionEditor = forwardRef<FormExpressionEditorRef, ExpressionEditorProps>((props, ref) => {
    const {
        autoFocus,
        control,
        field,
        watch,
        completions,
        triggerCharacters,
        retrieveCompletions,
        extractArgsFromFunction,
        getExpressionEditorDiagnostics,
        getHelperPane,
        onFocus,
        onBlur,
        onCompletionItemSelect,
        onSave,
        onCancel,
        onRemove,
        openSubPanel,
        handleOnFieldFocus,
        subPanelView,
        targetLineRange,
        fileName,
        visualizable,
        helperPaneOrigin,
        helperPaneHeight,
        recordTypeField,
        growRange = { start: 1, offset: 4 },
        rawExpression, // original expression
        sanitizedExpression // sanitized expression that will be rendered in the editor
    } = props as ExpressionEditorProps;
    const [focused, setFocused] = useState<boolean>(false);

    // If Form directly  calls ExpressionEditor without setting targetLineRange and fileName through context
    const { targetLineRange: contextTargetLineRange, fileName: contextFileName } = useFormContext();
    const effectiveTargetLineRange = targetLineRange ?? contextTargetLineRange;
    const effectiveFileName = fileName ?? contextFileName;

    const [isHelperPaneOpen, setIsHelperPaneOpen] = useState<boolean>(false);
    /* Define state to retrieve helper pane data */

    const exprRef = useRef<FormExpressionEditorRef>(null);
    const anchorRef = useRef<HTMLDivElement>(null);

    // Use to fetch initial diagnostics
    const fetchInitialDiagnostics = useRef<boolean>(true);
    const fieldValue = rawExpression ? rawExpression(watch(field.key)) : watch(field.key);

    useImperativeHandle(ref, () => exprRef.current);

    // Initial render
    useEffect(() => {
        // Fetch initial diagnostics
        if (getExpressionEditorDiagnostics && fieldValue !== undefined && fetchInitialDiagnostics.current) {
            fetchInitialDiagnostics.current = false;
            getExpressionEditorDiagnostics(
                !field.optional || fieldValue !== '',
                fieldValue,
                field.key,
                getPropertyFromFormField(field)
            );
        }
    }, [fieldValue]);

    const cursorPositionRef = useRef<number | undefined>(undefined);

    const handleFocus = async () => {
        setFocused(true);

        // Trigger actions on focus
        await onFocus?.();
        handleOnFieldFocus?.(field.key);
    };

    const handleBlur = async () => {
        setFocused(false);
        // Trigger actions on blur
        await onBlur?.();

        // Clean up memory
        cursorPositionRef.current = undefined;
    };

    const handleCompletionSelect = async (value: string, item: CompletionItem) => {
        // Trigger actions on completion select
        await onCompletionItemSelect?.(value, field.key, item.additionalTextEdits);

        // Set cursor position
        const cursorPosition = exprRef.current?.shadowRoot?.querySelector('textarea')?.selectionStart;
        cursorPositionRef.current = cursorPosition;
    };

    const handleOpenSubPanel = (view: SubPanelView, subPanelInfo: SubPanelViewProps) => {
        openSubPanel({
            view: view,
            props: view === SubPanelView.UNDEFINED ? undefined : subPanelInfo
        });
    };

    const handleInlineDataMapperOpen = (isUpdate: boolean) => {
        if (subPanelView === SubPanelView.INLINE_DATA_MAPPER && !isUpdate) {
            openSubPanel({ view: SubPanelView.UNDEFINED });
        } else {
            handleOpenSubPanel(SubPanelView.INLINE_DATA_MAPPER, {
                inlineDataMapper: {
                    filePath: effectiveFileName,
                    flowNode: undefined, // This will be updated in the Form component
                    position: {
                        line: effectiveTargetLineRange.startLine.line,
                        offset: effectiveTargetLineRange.startLine.offset
                    },
                    propertyKey: field.key,
                    editorKey: field.key
                }
            });
            handleOnFieldFocus?.(field.key);
        }
    };


    const handleChangeHelperPaneState = (isOpen: boolean) => {
        setIsHelperPaneOpen(isOpen);
    };

    const toggleHelperPaneState = () => {
        if (!isHelperPaneOpen) {
            exprRef.current?.focus();
        } else {
            handleChangeHelperPaneState(false);
        }
    };

    const handleGetHelperPane = (
        value: string,
        onChange: (value: string, updatedCursorPosition: number) => void,
        helperPaneHeight: HelperPaneHeight
    ) => {
        return getHelperPane?.(
            field.key,
            exprRef,
            anchorRef,
            field.placeholder,
            value,
            onChange,
            handleChangeHelperPaneState,
            helperPaneHeight,
            recordTypeField,
            field.type === "LV_EXPRESSION"
        );
    };

    const updateSubPanelData = (value: string) => {
        if (subPanelView === SubPanelView.INLINE_DATA_MAPPER) {
            handleInlineDataMapperOpen(true);
        }
    };

    const handleExtractArgsFromFunction = async (value: string, cursorPosition: number) => {
        return await extractArgsFromFunction(value, getPropertyFromFormField(field), cursorPosition);
    };

    const debouncedUpdateSubPanelData = debounce(updateSubPanelData, 300);

    const codeActions = [
        visualizable && (
            <Button appearance="icon" onClick={() => handleInlineDataMapperOpen(false)}>
                <S.DataMapperBtnTxt>Map Data Inline</S.DataMapperBtnTxt>
            </Button>
        )
    ];

    const defaultValueText = field.defaultValue ? 
        <div>Defaults to <S.DefaultValue>{field.defaultValue}</S.DefaultValue></div> : null;

    const documentation = field.documentation 
        ? field.documentation.endsWith('.') 
            ? field.documentation 
            : `${field.documentation}.`
        : '';
    
    const combinedDescription = (
        <>
            {documentation && <span>{documentation} </span>}
            {defaultValueText}
        </>
    );

    return (
        <S.Container>
            <S.HeaderContainer>
                <S.Header>
                    <S.LabelContainer>
                        <S.Label>{field.label}</S.Label>
                        {!field.optional && <RequiredFormInput />}
                    </S.LabelContainer>
                    <S.Description>{combinedDescription}</S.Description>
                </S.Header>
                {field.valueTypeConstraint && (
                    <S.Type isVisible={focused} title={field.valueTypeConstraint as string}>
                        {sanitizeType(field.valueTypeConstraint as string)}
                    </S.Type>
                )}
            </S.HeaderContainer>
            <Controller
                control={control}
                name={field.key}
                rules={{ required: !field.optional && !field.placeholder }}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <div>
                        <FormExpressionEditor
                            key={field.key}
                            ref={exprRef}
                            anchorRef={anchorRef}
                            name={name}
                            completions={completions}
                            value={sanitizedExpression ? sanitizedExpression(value) : value}
                            autoFocus={autoFocus}
                            startAdornment={<EditorRibbon onClick={toggleHelperPaneState} />}
                            onChange={async (updatedValue: string, updatedCursorPosition: number) => {
                                if (updatedValue === value) {
                                    return;
                                }

                                const rawValue = rawExpression ? rawExpression(updatedValue) : updatedValue;
                                onChange(rawValue);
                                debouncedUpdateSubPanelData(rawValue);
                                cursorPositionRef.current = updatedCursorPosition;

                                if (getExpressionEditorDiagnostics) {
                                    getExpressionEditorDiagnostics(
                                        !field.optional || rawValue !== '',
                                        rawValue,
                                        field.key,
                                        getPropertyFromFormField(field)
                                    );
                                }

                                // Check if the current character is a trigger character
                                const triggerCharacter =
                                    updatedCursorPosition > 0
                                        ? triggerCharacters.find((char) => rawValue[updatedCursorPosition - 1] === char)
                                        : undefined;
                                if (triggerCharacter) {
                                    await retrieveCompletions(
                                        rawValue,
                                        getPropertyFromFormField(field),
                                        updatedCursorPosition,
                                        triggerCharacter
                                    );
                                } else {
                                    await retrieveCompletions(
                                        rawValue,
                                        getPropertyFromFormField(field),
                                        updatedCursorPosition
                                    );
                                }
                            }}
                            extractArgsFromFunction={handleExtractArgsFromFunction}
                            onCompletionSelect={handleCompletionSelect}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onSave={onSave}
                            onCancel={onCancel}
                            onRemove={onRemove}
                            enableExIcon={false}
                            isHelperPaneOpen={isHelperPaneOpen}
                            changeHelperPaneState={handleChangeHelperPaneState}
                            helperPaneOrigin={helperPaneOrigin}
                            getHelperPane={handleGetHelperPane}
                            helperPaneHeight={helperPaneHeight}
                            helperPaneWidth={recordTypeField ? 400 : undefined}
                            growRange={growRange}
                            sx={{ paddingInline: '0' }}
                            codeActions={codeActions}
                        />
                        {error && <ErrorBanner errorMsg={error.message.toString()} />}
                    </div>
                )}
            />
        </S.Container>
    );
});
