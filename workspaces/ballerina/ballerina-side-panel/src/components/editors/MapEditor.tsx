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

// Reusing the same styled components namespace
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

    export const KeyValueContainer = styled.div({
        display: "flex",
        gap: "8px",
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

interface MapEditorProps {
    field: FormField;
    label: string;
}

export function MapEditor(props: MapEditorProps) {
    const { field, label } = props;
    const { form } = useFormContext();
    const { register, unregister, setValue, watch, formState } = form;

    const initialValues = Array.isArray(field.value) ? field.value : [];
    const [editorCount, setEditorCount] = useState(Math.max(initialValues.length, 1));

    // Add useEffect to set initial values
    useEffect(() => {
        if (Array.isArray(field.value) && field.value.length > 0) {
            field.value.forEach((item, index) => {
                const key = Object.keys(item)[0];
                const value = Object.values(item)[0];
                setValue(`${field.key}-${index}-key`, key);
                setValue(`${field.key}-${index}-value`, value);
            });
        }
    }, [field.value, field.key, setValue]);

    // Watch all the individual key-value pair values
    const values = [...Array(editorCount)]
        .map((_, index) => {
            const key = watch(`${field.key}-${index}-key`);
            const value = watch(`${field.key}-${index}-value`);
            
            if (!key && !value) return undefined;
            
            return {
                [key]: value
            };
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
        // Unregister the deleted fields
        unregister(`${field.key}-${indexToDelete}-key`);
        unregister(`${field.key}-${indexToDelete}-value`);

        // Unregister and re-register fields after the deleted index to shift them up
        for (let i = indexToDelete + 1; i < editorCount; i++) {
            const keyValue = watch(`${field.key}-${i}-key`);
            const valueValue = watch(`${field.key}-${i}-value`);
            
            unregister(`${field.key}-${i}-key`);
            unregister(`${field.key}-${i}-value`);
            
            setValue(`${field.key}-${i-1}-key`, keyValue);
            setValue(`${field.key}-${i-1}-value`, valueValue);
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
                    <S.KeyValueContainer>
                        <TextField
                            id={`${field.key}-${index}-key`}
                            {...register(`${field.key}-${index}-key`, {
                                validate: {
                                    keyFormat: (value, formValues) => {
                                        // If there's no value but the corresponding value field is filled
                                        const correspondingValue = watch(`${field.key}-${index}-value`);
                                        if (correspondingValue && !value) {
                                            return "Key is required when value is provided";
                                        }
                                        
                                        // If there's a value, validate its format
                                        if (value) {
                                            if (/^\d/.test(value)) {
                                                return "Key cannot start with a number";
                                            }
                                            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                                                return "Key can only contain letters, numbers, and underscores";
                                            }
                                            
                                            // Check for uniqueness only if there's a value
                                            const keys = values
                                                .map((_, i) => watch(`${field.key}-${i}-key`))
                                                .filter((_, i) => i !== index);
                                            if (keys.includes(value)) {
                                                return "Key must be unique";
                                            }
                                        }
                                        return true;
                                    }
                                }
                            })}
                            placeholder="Key"
                            disabled={!field.editable}
                            sx={{ width: "100%" }}
                            errorMsg={formState?.errors[`${field.key}-${index}-key`]?.message as string}
                        />
                        <TextField
                            id={`${field.key}-${index}-value`}
                            {...register(`${field.key}-${index}-value`)}
                            placeholder="Value"
                            disabled={!field.editable}
                            sx={{ width: "100%" }}
                        />
                    </S.KeyValueContainer>
                    <S.DeleteButton
                        appearance="icon"
                        onClick={() => onDelete(index)}
                        disabled={!field.editable}
                        tooltip="Delete"
                    >
                        <Codicon name="trash" />
                    </S.DeleteButton>
                </S.EditorContainer>
            ))}
            <S.AddNewButton appearance="icon" aria-label="add" onClick={onAddAnother}>
                <Codicon name="add" />
                {label}
            </S.AddNewButton>
        </S.Container>
    );
}
