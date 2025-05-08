/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { TextField, Position } from '@wso2-enterprise/ui-toolkit';
import { AddImportItemResponse, Imports, Type } from '@wso2-enterprise/ballerina-core';
import { typeToSource } from './TypeUtil';
import { TypeHelper, TypeHelperItem } from '../TypeHelper';
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { URI, Utils } from 'vscode-uri';
import { debounce } from 'lodash';
import { useTypeHelperContext } from '../Context';

interface TypeFieldProps {
    type: string | Type;
    memberName: string;
    onChange: (value: string) => void;
    onUpdateImports: (imports: Imports) => void;
    placeholder?: string;
    sx?: React.CSSProperties;
    onValidationError?: (isError: boolean) => void;
    rootType: Type;
    isAnonymousRecord?: boolean;
    label?: string;
    required?: boolean;
    autoFocus?: boolean;
}

export const TypeField = forwardRef<HTMLInputElement, TypeFieldProps>((props, ref) => {
    const {
        type,
        onChange,
        onUpdateImports,
        placeholder,
        sx,
        memberName,
        rootType,
        onValidationError,
        isAnonymousRecord,
        label,
        required,
        autoFocus
    } = props;
    const { onTypeItemClick, ...rest } = useTypeHelperContext();

    const typeFieldRef = useRef<HTMLInputElement>(null);
    const typeHelperRef = useRef<HTMLDivElement>(null);
    const typeBrowserRef = useRef<HTMLDivElement>(null);
    const [typeFieldCursorPosition, setTypeFieldCursorPosition] = useState<number>(0);
    const [helperPaneOffset, setHelperPaneOffset] = useState<Position>({ top: 0, left: 0 });
    const [helperPaneOpened, setHelperPaneOpened] = useState<boolean>(false);
    const [typeError, setTypeError] = useState<string>("");
    const { rpcClient } = useRpcContext();


    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        validateType(e.target.value);
    };

    const handleTypeHelperChange = (newType: string, newCursorPosition: number) => {
        onChange(newType);
        validateType(newType);

        setTypeFieldCursorPosition(newCursorPosition);

        // Focus the type field
        typeFieldRef.current?.focus();
        // Set cursor position
        typeFieldRef.current?.shadowRoot
            ?.querySelector('input')
            ?.setSelectionRange(newCursorPosition, newCursorPosition);
    };

    const handleTypeFieldFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const rect = typeFieldRef.current.getBoundingClientRect();
        const sidePanelLeft = window.innerWidth - 400; // Side panel width
        const helperPaneLeftOffset = sidePanelLeft - rect.left;
        setHelperPaneOffset({ top: 0, left: helperPaneLeftOffset });
        setHelperPaneOpened(true);
        validateType(e.target.value);
    };

    const handleTypeFieldBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        /* Prevent blur event when clicked on the type helper */
        const searchElements = Array.from(document.querySelectorAll('#helper-pane-search'));
        if (
            (typeHelperRef.current?.contains(e.relatedTarget as Node) ||
                typeBrowserRef.current?.contains(e.relatedTarget as Node)) &&
            !searchElements.some(element => element.contains(e.relatedTarget as Node))
        ) {
            e.preventDefault();
            e.stopPropagation();
            typeFieldRef.current?.shadowRoot?.querySelector('input')?.focus();
        }

        validateType(e.target.value);
    };

    const validateType = useCallback(debounce(async (value: string) => {
        if (isAnonymousRecord) {
            return;
        }

        // Skip validation for imported module types (module:Type format) till imported validation are sorted
        if (value.includes(':')) {
            const [moduleName, typeName] = value.split(':');
            if (moduleName && typeName) {
                // Valid module:Type format, skip validation
                return;
            }
        }
        const projectUri = await rpcClient.getVisualizerLocation().then((res) => res.projectUri);

        const endPosition = await rpcClient.getBIDiagramRpcClient().getEndOfFile({
            filePath: Utils.joinPath(URI.file(projectUri), 'types.bal').fsPath
        });

        const response = await rpcClient.getBIDiagramRpcClient().getExpressionDiagnostics({
            filePath: rootType?.codedata?.lineRange?.fileName || "types.bal",
            context: {
                expression: value,
                startLine: {
                    line: rootType?.codedata?.lineRange?.startLine?.line ?? endPosition.line,
                    offset: rootType?.codedata?.lineRange?.startLine?.offset ?? endPosition.offset
                },
                offset: 0,
                lineOffset: 0,
                codedata: {
                    node: "VARIABLE",
                    lineRange: {
                        startLine: {
                            line: rootType?.codedata?.lineRange?.startLine?.line ?? endPosition.line,
                            offset: rootType?.codedata?.lineRange?.startLine?.offset ?? endPosition.offset
                        },
                        endLine: {
                            line: rootType?.codedata?.lineRange?.endLine?.line ?? endPosition.line,
                            offset: rootType?.codedata?.lineRange?.endLine?.offset ?? endPosition.offset
                        },
                        fileName: rootType?.codedata?.lineRange?.fileName
                    },
                },
                property: {
                    metadata: {
                        label: "",
                        description: "",
                    },
                    valueType: "TYPE",
                    value: "",
                    optional: false,
                    editable: true
                }
            }
        });
        if (response.diagnostics.length > 0) {
            setTypeError(response.diagnostics[0].message);
            onValidationError?.(true);
        } else {
            setTypeError("");
            onValidationError?.(false);
        }
    }, 250), [rpcClient, rootType]);

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }

        const range = selection.getRangeAt(0);

        if (typeFieldRef.current?.parentElement?.contains(range.startContainer)) {
            setTypeFieldCursorPosition(
                typeFieldRef.current.shadowRoot.querySelector('input').selectionStart ?? 0
            );
        }
    };

    const handleTypeItemClick = async (item: TypeHelperItem): Promise<string> => {
        const response = await onTypeItemClick(item) as AddImportItemResponse;
        if (response.prefix && response.moduleId) {
            const importStatement = {
                [response.prefix]: response.moduleId
            }
            onUpdateImports(importStatement);
        }
        return response.template;
    };

    /* Track cursor position */
    useEffect(() => {
        const typeField = typeFieldRef.current;
        if (!typeField) {
            return;
        }

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [typeFieldRef.current]);

    return (
        <>
            <TextField
                ref={typeFieldRef}
                placeholder={placeholder}
                sx={sx}
                value={memberName}
                errorMsg={typeError}
                onChange={handleTypeChange}
                onFocus={handleTypeFieldFocus}
                onBlur={handleTypeFieldBlur}
                label={label}
                required={required}
                autoFocus={autoFocus}
            />
            <TypeHelper
                ref={typeHelperRef}
                typeFieldRef={typeFieldRef}
                typeBrowserRef={typeBrowserRef}
                currentType={typeToSource(type)}
                currentCursorPosition={typeFieldCursorPosition}
                onChange={handleTypeHelperChange}
                positionOffset={helperPaneOffset}
                open={helperPaneOpened}
                onClose={() => setHelperPaneOpened(false)}
                onTypeItemClick={handleTypeItemClick}
                {...rest}
            />
        </>
    );
});
