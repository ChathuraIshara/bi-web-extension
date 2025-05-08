/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect } from "react";
import { Button, TextField, SidePanel, SidePanelTitleContainer, SidePanelBody, Codicon, FormCheckBox, TextArea, Typography } from "@wso2-enterprise/ui-toolkit";
import * as yup from "yup";
import styled from "@emotion/styled";
import { SIDE_PANEL_WIDTH } from "../../../../constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const ActionContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    padding-bottom: 20px;
`;

const SidePanelBodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

namespace Section {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    export const Title = styled.h4`
        display: flex;
        align-items: center;
        margin: 0;
        padding: 2px;
        width: 100%;
    `;

    export const IconContainer = styled.div`
        margin-left: auto;
    `;
}

type OperationFields = {
    operationName?: string;
    description?: string;
    enableStreaming?: boolean;
};

const newOperation: OperationFields = {
    operationName: "",
    description: "",
    enableStreaming: false
};

const schema = yup.object({
    operationName: yup.string().required("Operation name is required"),
    description: yup.string().notRequired(),
    enableStreaming: yup.boolean().notRequired()
});

export type OperationType = yup.InferType<typeof schema>;

export type OperationFormData = OperationType & {
    mode: "create" | "edit";
};

type OperationFormProps = {
    formData?: OperationType;
    isOpen: boolean;
    documentUri: string;
    onCancel: () => void;
    onSave: (data: OperationFormData) => void;
};

export const OperationForm = ({ isOpen, onCancel, onSave, formData }: OperationFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        register,
        reset
    } = useForm({
        defaultValues: newOperation,
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        if (isOpen && formData) {
            reset(formData);
        } else if (isOpen && !formData) {
            reset(newOperation);
        }
    }, [formData, isOpen])

    const handleOperationSubmit = (data: OperationType) => {
        const metaData: OperationFormData = {
            mode: formData ? "edit" : "create",
        };
        onSave({ ...data, ...metaData });
    };

    const renderProps = (fieldName: keyof OperationFields) => {
        return {
            id: fieldName,
            errorMsg: errors[fieldName] && errors[fieldName].message.toString(),
            ...register(fieldName)
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <SidePanel
            isOpen={isOpen}
            alignment="right"
            width={SIDE_PANEL_WIDTH}
            overlay={false}
            sx={{ transition: "all 0.3s ease-in-out" }}
        >
            <SidePanelTitleContainer>
                <Typography variant="h3" sx={{margin: 0}}>{`${formData ? "Edit" : "Add"} Operation`}</Typography>
                <Button sx={{ marginLeft: "auto" }} onClick={onCancel} appearance="icon">
                    <Codicon name="close" />
                </Button>
            </SidePanelTitleContainer>
            <SidePanelBody style={{ overflowY: "scroll" }}>
                <SidePanelBodyWrapper>
                    <TextField
                        label="Operation Name"
                        required
                        size={150}
                        {...renderProps('operationName')}
                    />
                    <TextArea
                        label="Description"
                        {...renderProps('description')}
                    />
                    <FormCheckBox label="Enable Streaming" control={control}
                                  {...renderProps('enableStreaming')}
                    />
                    <ActionContainer>
                        <Button appearance="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={handleSubmit(handleOperationSubmit)}
                            disabled={!isDirty}
                        >
                            {formData ? "Update" : "Add"}
                        </Button>
                    </ActionContainer>
                </SidePanelBodyWrapper>
            </SidePanelBody>
        </SidePanel>
    );
};
