/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    FormView,
    FormActions,
    FormCheckBox,
    FormAutoComplete,
} from "@wso2-enterprise/ui-toolkit";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { useForm } from "react-hook-form";
import { FormKeylookup } from "@wso2-enterprise/mi-diagram";
import { set } from "lodash";

export type EditSequenceFields = {
    name?: string;
    onError?: string;
    trace?: boolean;
    statistics?: boolean;
}

export type ResourceProps = {
    isOpen: boolean;
    sequenceData: EditSequenceFields;
    onCancel: () => void;
    onSave: (data: EditSequenceFields) => void;
    documentUri: string;
};

export function EditSequenceForm({ sequenceData, isOpen, onCancel, onSave, documentUri }: ResourceProps) {

    const { rpcClient } = useVisualizerContext();
    const [artifactNames, setArtifactNames] = useState([]);
    const [workspaceFileNames, setWorkspaceFileNames] = useState([]);

    const initialSequence: EditSequenceFields = {
        name: sequenceData.name,
        onError: sequenceData.onError,
        trace: sequenceData.trace,
        statistics: sequenceData.statistics,
    };

    const schema = yup.object({
        name: yup.string().required("Sequence name is required").matches(/^[a-zA-Z0-9_-]*$/, "Invalid characters in sequence name")
            .test('validateSequenceName',
                'An artifact with same name already exists', value => {
                    return !(workspaceFileNames.includes(value) && sequenceData.name !== value)
                }).test('validateArtifactName',
                    'A registry resource with this artifact name already exists', value => {
                        return !(artifactNames.includes(value) && sequenceData.name !== value)
                    }),
        endpoint: yup.string().notRequired(),
        onError: yup.string().notRequired(),
        trace: yup.boolean().default(false),
        statistics: yup.boolean().default(false),
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty },
    } = useForm<EditSequenceFields>({
        defaultValues: initialSequence,
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        (async () => {
            const artifactRes = await rpcClient.getMiDiagramRpcClient().getAllArtifacts({
                path: documentUri,
            });
            setWorkspaceFileNames(artifactRes.artifacts);
            const regArtifactRes = await rpcClient.getMiDiagramRpcClient().getAvailableRegistryResources({
                path: documentUri
            });
            setArtifactNames(regArtifactRes.artifacts);
        })();
    }, []);

    return (
        <FormView title={`Edit Sequence : ${sequenceData.name}`} onClose={onCancel}>
            <TextField
                id='seqName'
                label="Name"
                placeholder="Name"
                errorMsg={errors.name?.message.toString()}
                {...register("name")}
            />
            <FormCheckBox
                label="Enable statistics"
                {...register("statistics")}
                control={control}
            />
            <FormCheckBox
                label="Enable tracing"
                {...register("trace")}
                control={control}
            />
            <FormKeylookup
                control={control}
                label="On Error Sequence"
                name="onErrorSequence"
                filterType="sequence"
                path={documentUri}
                errorMsg={errors.onError?.message.toString()}
                {...register("onError")}
            />
            <FormActions>
                <Button
                    appearance="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    appearance="primary"
                    disabled={!isDirty}
                    onClick={handleSubmit((values) => onSave(values))}
                >
                    Update
                </Button>
            </FormActions>
        </FormView>
    );
}

