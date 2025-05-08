/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, ReactNode } from "react";
import { TextArea } from "@wso2-enterprise/ui-toolkit";

interface RowRange {
    start: number;
    offset: number;
}

interface CodeTextAreaProps {
    label?: string;
    id?: string;
    className?: string;
    autoFocus?: boolean;
    required?: boolean;
    errorMsg?: string;
    labelAdornment?: ReactNode;
    placeholder?: string;
    cols?: number;
    rows?: number;
    growRange?: RowRange;
    validationMessage?: string;
    sx?: any;
    name?: string;
    value?: string;
    onTextChange?: (text: string) => void;
    onChange?: (e: any) => void;
}

export const CodeTextArea = forwardRef<HTMLTextAreaElement, CodeTextAreaProps>((props, ref) => {
    const { growRange, onTextChange, onChange, ...rest } = props;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [rows, setRows] = useState(props.rows || growRange.start || 1);

    useImperativeHandle(ref, () => textAreaRef.current);

    useEffect(() => {
        if (textAreaRef.current) {
            const textarea = textAreaRef.current.shadowRoot.querySelector("textarea");
            const handleOnKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Tab") {
                    event.preventDefault();
                    const selectionStart = textarea.selectionStart;
                    textarea.setRangeText("  ", selectionStart, selectionStart, "end");
                }
            };

            textarea.addEventListener("keydown", handleOnKeyDown);
            return () => {
                textarea.removeEventListener("keydown", handleOnKeyDown);
            };
        }
    }, [textAreaRef]);

    const growTextArea = (text: string) => {
        const { start, offset } = growRange;
        const lineCount = text.split("\n").length;
        const newRows = Math.max(start, Math.min(start + offset, lineCount));
        setRows(newRows);
    };

    const handleChange = (e: any) => {
        if (growRange) {
            growTextArea(e.target.value);
        }
        onChange && onChange(e);
    };

    return <TextArea ref={textAreaRef} onChange={handleChange} rows={rows} {...rest} />;
});
