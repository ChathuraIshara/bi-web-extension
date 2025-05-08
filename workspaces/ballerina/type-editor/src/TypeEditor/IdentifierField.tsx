/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Type } from "@wso2-enterprise/ballerina-core";
import { TextField } from "@wso2-enterprise/ui-toolkit/lib/components/TextField/TextField";
import React, { ChangeEvent, forwardRef, useCallback, useState } from "react";
import { useRpcContext } from '@wso2-enterprise/ballerina-rpc-client';
import { URI, Utils } from "vscode-uri";
import { debounce } from "lodash";

interface IdentifierFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rootType: Type;
    label?: string;
    onValidationError?: (isError: boolean) => void;
    autoFocus?: boolean;
}

export const IdentifierField = forwardRef<HTMLInputElement, IdentifierFieldProps>((props, ref) => {
    const {
        value,
        onChange,
        placeholder,
        rootType,
        label,
        onValidationError,
        autoFocus
    } = props;

    const [internalErrorMsg, setInternalErrorMsg] = useState<string>("");
    const { rpcClient } = useRpcContext();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
        validateIdentifierName(event.target.value);
    };

    const validateIdentifierName = useCallback(debounce(async (value: string) => {
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
                    valueType: "IDENTIFIER",
                    value: "",
                    valueTypeConstraint: "Object",
                    optional: false,
                    editable: true
                }
            }
        });


        if (response.diagnostics.length > 0) {
            setInternalErrorMsg(response.diagnostics[0].message);
            onValidationError?.(true);
        } else {
            setInternalErrorMsg("");
            onValidationError?.(false);
        }
    }, 250), [rpcClient, rootType]);

    const handleOnBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
        validateIdentifierName(e.target.value);
    };

    const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        validateIdentifierName(e.target.value);
    }

    return (
        <TextField
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            placeholder={placeholder}
            errorMsg={internalErrorMsg}
            label={label}
            autoFocus={autoFocus}
        />
    );
});
