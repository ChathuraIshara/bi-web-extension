/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";

import { Button, Codicon, TextField, ThemeColors } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";

import { FormField } from "../Form/types";
import { useFormContext } from "../../context";

namespace S {
    export const Container = styled.div({
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    });

    export const LabelContainer = styled.div({
        display: "flex",
        alignItems: "center",
    });

    export const Label = styled.label({
        color: "var(--vscode-editor-foreground)",
        textTransform: "capitalize",
    });

    export const Description = styled.div({
        color: "var(--vscode-list-deemphasizedForeground)",
    });

    export const EditorContainer = styled.div({
        display: "flex",
        gap: "8px",
        alignItems: "center",
        width: "100%",
    });

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

    export const DeleteButton = styled(Button)`
        & > vscode-button {
            color: ${ThemeColors.ERROR};
        }
    `;
}

interface ArrayEditorProps {
    field: FormField;
    label: string;
}

export function ArrayEditor(props: ArrayEditorProps) {
    const { field, label } = props;
    const { form } = useFormContext();
    const { register, unregister, setValue, watch } = form;

    // Initialize with array values or empty array
    const initialValues = Array.isArray(field.value) ? field.value : [];
    const [editorCount, setEditorCount] = useState(Math.max(initialValues.length, 0));

    // Watch all the individual text field values
    const values = [...Array(editorCount)]
        .map((_, index) => {
            const value = watch(`${field.key}-${index}`);
            // Use the initial array value if available, otherwise undefined
            return value ?? (Array.isArray(field.value) ? field.value[index] : undefined);
        })
        .filter(Boolean);

    // Update the main field.value array whenever individual fields change
    useEffect(() => {
        setValue(field.key, values);
    }, [values, field.key, setValue]);

    const onAddAnother = () => {
        setEditorCount((prev) => prev + 1);
    };

    const onDelete = (indexToDelete: number) => {
        // Unregister the deleted field
        unregister(`${field.key}-${indexToDelete}`);

        // Unregister and re-register fields after the deleted index to shift them up
        for (let i = indexToDelete + 1; i < editorCount; i++) {
            const value = watch(`${field.key}-${i}`);
            unregister(`${field.key}-${i}`);
            setValue(`${field.key}-${i - 1}`, value);
        }

        // Update the main field value
        const newValues = values.filter((_, i) => i !== indexToDelete);
        setValue(field.key, newValues);
        setEditorCount((prev) => prev - 1);
    };

    return (
        <S.Container>
            <S.LabelContainer>
                <S.Label>{field.label}</S.Label>
            </S.LabelContainer>
            <S.Description>{field.documentation}</S.Description>
            {[...Array(editorCount)].map((_, index) => (
                <S.EditorContainer key={`${field.key}-${index}`}>
                    <TextField
                        id={`${field.key}-${index}`}
                        {...register(`${field.key}-${index}`, {
                            required: !field.optional && index === 0,
                            // Initialize with value from the array if available
                            value: Array.isArray(field.value) ? field.value[index] : '',
                        })}
                        required={!field.optional && index === 0}
                        disabled={!field.editable}
                        sx={{ width: "100%" }}
                    />
                    {
                        <S.DeleteButton
                            appearance="icon"
                            onClick={() => onDelete(index)}
                            disabled={!field.editable}
                            tooltip="Delete"
                        >
                            <Codicon name="trash" />
                        </S.DeleteButton>
                    }
                </S.EditorContainer>
            ))}
            <S.AddNewButton appearance="icon" aria-label="add" onClick={onAddAnother}>
                <Codicon name="add" />
                {label}
            </S.AddNewButton>
        </S.Container>
    );
}
