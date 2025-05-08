/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import { Button, Codicon, FormActions, LinkButton, Typography } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import FormGenerator from '../FormGenerator';
import { useForm } from 'react-hook-form';
import { ExpressionFieldValue } from '../ExpressionField/ExpressionInput';
import { Colors } from '../../../resources/constants';
import { Range } from "@wso2-enterprise/mi-syntax-tree/lib/src";

const Container = styled.div`
    margin-top: 10px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid ${Colors.OUTLINE_VARIANT};
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: ${Colors.SECONDARY_CONTAINER};

    p {
        margin: 0;
    }
`;

const ActionWrapper = styled.div`
    padding: 5px;
    width: 50px;
    display: flex;
    flex-direction: row;
`;

const ActionIconWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 14px;
    width: 14px;
`;

const EditIconWrapper = styled.div`
    cursor: pointer;
    color: var(--vscode-statusBarItem-remoteBackground);
`;

const DeleteIconWrapper = styled.div`
    cursor: pointer;
    margin-left: 10px;
    color: var(--vscode-notificationsErrorIcon-foreground);
`;

const FormWrapper = styled.div`
    padding: 20px;
    background-color: ${Colors.SECONDARY_CONTAINER};
    border: 1px solid ${Colors.OUTLINE_VARIANT};
    border-radius: 8px;
    margin: 10px 0;
    transition: all 0.3s ease-in-out;
    animation: fadeIn 0.2s forwards;
`;

export interface Param {
}

export interface ParameterManagerProps {
    formData: any;
    parameters?: Param[];
    nodeRange?: Range;
    setParameters?: (params: Param[]) => void;
}
const ParameterManager = (props: ParameterManagerProps) => {
    const { formData, nodeRange, parameters, setParameters } = props;
    const { addParamText, noDataText, readonly, tableKey, tableValue } = formData;
    const { control, setValue, getValues, reset, watch, handleSubmit, formState: { errors } } = useForm();

    const [isAdding, setIsAdding] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const handleAddParameter = () => {
        reset({});
        setIsAdding(true);
    };

    const handleOnCancel = () => {
        reset({});
        setIsAdding(false);
        setIsUpdate(false);
    }

    const handleEditParameter = (param: Param, index: number) => {
        reset(param);
        setCurrentIndex(index);
        setIsUpdate(true);
    };

    const handleDeleteParameter = (param: Param) => {
        const updatedParams = parameters.filter((p: Param) => p !== param);
        setParameters(updatedParams);
    };

    const handleFormSubmit = (data: any) => {
        if (isUpdate && currentIndex !== null) {
            parameters[currentIndex] = data;
            setParameters(parameters);
            setIsUpdate(false);
            setCurrentIndex(null);
            return;
        }
        setParameters([...parameters, data]);
        setIsAdding(false);
    };

    const getFieldValue = (field: string | number | ExpressionFieldValue): string | number => {
        if (typeof field === 'object' && field !== null) {
            if ('value' in field) {
                return field.value;
            } else if (Array.isArray(field)) {
                return getFieldValue(field[0])
            } else {
                return (Object.values(field)[0] || '').toString()
            }
        }
        return field as string | number || '';
    }

    const Form = () => {
        return <FormWrapper>
            <FormGenerator
                formData={formData}
                range={nodeRange}
                control={control}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                reset={reset}
                watch={watch} />

            <FormActions sx={{
                backgroundColor: Colors.SECONDARY_CONTAINER,
            }}>
                <Button
                    appearance="secondary"
                    onClick={handleOnCancel}
                >
                    Cancel
                </Button>
                <Button
                    appearance="primary"
                    onClick={handleSubmit(handleFormSubmit)}
                >
                    {isUpdate ? "Update" : "Add"}
                </Button>
            </FormActions>
        </FormWrapper>;
    }

    return (
        <Container>
            {parameters.length === 0 && (
                <Typography variant="body3">
                    {noDataText || 'No data available'}
                </Typography>
            )}
            {parameters?.map((param: Param, index: number) => (
                <>
                    <Row key={index}>
                        <div
                            style={{
                                backgroundColor: Colors.PRIMARY,
                                padding: '5px',
                                flex: 1,
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                                height: !param[tableKey as keyof Param] && 15,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: Colors.ON_PRIMARY
                                }}
                            >{getFieldValue(param[tableKey as keyof Param]) ?? (index + 1)}</Typography>
                        </div>
                        <div
                            style={{
                                backgroundColor: Colors.SURFACE_CONTAINER,
                                padding: '5px',
                                flex: 2,
                                overflow: 'hidden',
                                borderTopRightRadius: 4,
                                borderBottomRightRadius: 4,
                                height: !getFieldValue(param[tableValue as keyof Param]) && 15,
                            }}
                        >
                            <Typography>{getFieldValue(param[tableValue as keyof Param])}</Typography>
                        </div>

                        {!readonly && !isAdding && !isUpdate && (
                            <ActionWrapper>
                                <ActionIconWrapper>
                                    <EditIconWrapper>
                                        <Codicon name="edit" onClick={() => handleEditParameter(param, index)} />
                                    </EditIconWrapper>
                                    <DeleteIconWrapper>
                                        <Codicon name="trash" onClick={() => handleDeleteParameter(param)} />
                                    </DeleteIconWrapper>
                                </ActionIconWrapper>
                            </ActionWrapper>
                        )}
                    </Row>

                    {(isUpdate && currentIndex === index) && (
                        <div style={{ marginTop: "-10px" }}>
                            {Form()}
                        </div>
                    )}
                </>
            ))}

            {!readonly && !isAdding && !isUpdate && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LinkButton onClick={handleAddParameter}>
                        <Codicon name="add" />
                        {addParamText || 'Add Parameter'}
                    </LinkButton>
                </div>
            )}

            {isAdding && (
                Form()
            )}
        </Container>
    );

};

export default ParameterManager;
