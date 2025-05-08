/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { FormField } from "../Form/types";
import { AutoResizeTextArea } from "@wso2-enterprise/ui-toolkit";
import { useFormContext } from "../../context";
import { S } from "./ExpressionEditor";
import { Controller } from "react-hook-form";

interface TextAreaEditorProps {
    field: FormField;
    handleOnFieldFocus?: (key: string) => void;
    autoFocus?: boolean;
}

export function TextAreaEditor(props: TextAreaEditorProps) {
    const { field, handleOnFieldFocus, autoFocus } = props;
    const { form } = useFormContext();
    const { control } = form;

    const errorMsg = field.diagnostics?.map((diagnostic) => diagnostic.message).join("\n");

    return (
        <S.Container>
            <S.HeaderContainer>
                <S.Header>
                    <S.LabelContainer>
                        <S.Label>{field.label}</S.Label>
                    </S.LabelContainer>
                    <S.Description>{field.documentation}</S.Description>
                </S.Header>
            </S.HeaderContainer>
            <Controller
                control={control}
                name={field.key}
                defaultValue={field.value}
                rules={{
                    required: {
                        value: !field.optional && !field.placeholder,
                        message: `${field.label} is required`
                    }
                }}
                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <div>
                        <AutoResizeTextArea
                            id={field.key}
                            name={name}
                            required={!field.optional}
                            placeholder={field.placeholder}
                            readOnly={!field.editable}
                            value={value}
                            sx={{ width: "100%" }}
                            errorMsg={errorMsg}
                            onFocus={() => handleOnFieldFocus?.(field.key)}
                            autoFocus={autoFocus}
                            onChange={onChange}
                            growRange={{ start: 4, offset: 12 }}
                        />
                    </div>
                )}
            />
        </S.Container>
    );
}
