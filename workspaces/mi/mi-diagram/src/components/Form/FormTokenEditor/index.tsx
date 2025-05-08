/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { CSSProperties, ReactNode, useCallback, useMemo, useState } from "react";
import { Range } from 'vscode-languageserver-types';

import styled from "@emotion/styled";
import { ErrorBanner, RequiredFormInput, TokenEditor, Typography } from "@wso2-enterprise/ui-toolkit";

import { getHelperPane } from "../HelperPane";

namespace S {
    export const Container = styled.div<{ sx?: CSSProperties }>`
        width: 100%;
        gap: 2px;

        ${({ sx }: { sx?: CSSProperties }) => sx}
    `

    export const Header = styled.div({
        display: 'flex',
    });

    export const Label = styled.label({
        color: 'var(--vscode-editor-foreground)',
        textTransform: 'capitalize',
    });

    export const AdornmentContainer = styled.div({
        width: '22px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--vscode-inputOption-activeBackground)'
    })
}

/**
 * Props for FormTokenEditor
 * @param nodeRange - The range of the node with the token editor
 * @param id - The id of the token editor
 * @param value - The value of the token editor
 * @param onChange - Callback function to be called when the value changes
 * @param labelAdornment - The label adornment to display
 * @param label - The label of the token editor
 * @param placeholder - The placeholder of the token editor
 * @param required - Whether the token editor is required
 * @param errorMsg - The error message to display
 */
type FormTokenEditorProps = {
    nodeRange: Range;
    id?: string;
    value: string;
    onChange: (value: string) => void;
    labelAdornment?: ReactNode;
    label?: string;
    placeholder?: string;
    required?: boolean;
    errorMsg?: string;

    sx?: CSSProperties;
    editorSx?: CSSProperties;
}

export const FormTokenEditor = ({
    nodeRange,
    id,
    value,
    onChange,
    labelAdornment,
    label,
    required,
    errorMsg,
    sx,
    editorSx
}: FormTokenEditorProps) => {
    const [isHelperPaneOpen, setIsHelperPaneOpen] = useState<boolean>(false);

    const handleChangeHelperPaneState = (isOpen: boolean) => {
        setIsHelperPaneOpen(isOpen);
    }

    const handleGetHelperPane = useCallback((onChange: (value: string) => void, addFunction: (value: string) => void) => {
        const position = nodeRange ?
            nodeRange?.start == nodeRange?.end
                ? nodeRange.start
                : { line: nodeRange.start.line, character: nodeRange.start.character + 1 } : undefined;

        return getHelperPane(
            position,
            'default',
            () => handleChangeHelperPaneState(false),
            onChange,
            addFunction,
            { width: 'auto', border: '1px solid var(--dropdown-border)' }
        );
    }, [nodeRange, handleChangeHelperPaneState, getHelperPane]);

    const actionButtons = useMemo(() => {
        return [
            {
                tooltip: 'Open Expression Editor',
                iconType: 'icon' as const,
                name: 'function-icon',
                onClick: () => handleChangeHelperPaneState(!isHelperPaneOpen)
            }
        ];
    }, [isHelperPaneOpen, handleChangeHelperPaneState]);

    const getExpressionEditorIcon = useCallback((): ReactNode => {
        return undefined;
    }, []);

    return (
        <S.Container id={id} sx={sx}>
            <S.Header>
                <S.Label>{label}</S.Label>
                {required && <RequiredFormInput />}
                {labelAdornment}
            </S.Header>
            <TokenEditor
                value={value}
                onChange={onChange}
                actionButtons={actionButtons}
                getHelperPane={handleGetHelperPane}
                helperPaneOrigin="left"
                isHelperPaneOpen={isHelperPaneOpen}
                changeHelperPaneState={setIsHelperPaneOpen}
                getExpressionEditorIcon={getExpressionEditorIcon}
                startAdornment={
                    <S.AdornmentContainer>
                        <Typography variant="h4" sx={{ margin: 0 }}>
                            {"${"}
                        </Typography>
                    </S.AdornmentContainer>
                }
                endAdornment={
                    <S.AdornmentContainer>
                        <Typography variant="h4" sx={{ margin: 0 }}>
                            {"}"}
                        </Typography>
                    </S.AdornmentContainer>
                }
                editorSx={editorSx}
            />
            {errorMsg && <ErrorBanner errorMsg={errorMsg} />}
        </S.Container>
    );
}
