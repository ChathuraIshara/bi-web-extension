/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Button, TextField, FormView, FormActions } from "@wso2-enterprise/ui-toolkit";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { EVENT_TYPE, MACHINE_VIEW } from "@wso2-enterprise/mi-core";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useForm } from "react-hook-form";

export interface ClassMediatorProps {
    path: string;
}

type InputsFields = {
    packageName?: string;
    className?: string;
};

const initialClassMediator: InputsFields = {
    packageName: "com.example",
    className: "SampleMediator"
};

const schema = yup.object({
    packageName: yup.string()
        .required("Package Name is required")
        .matches(/^([a-zA-Z_$][a-zA-Z\d_$]*\.)*[a-zA-Z_$][a-zA-Z\d_$]*$/, "Invalid Package Name"),
    className: yup.string()
        .required("Class Name is required")
        .matches(/^[A-Z][a-zA-Z\d_$]*$/, "Invalid Class Name")
});

export function ClassMediatorForm(props: ClassMediatorProps) {

    const { rpcClient } = useVisualizerContext();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: initialClassMediator,
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    const openOverview = () => {
        rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Overview } });
    };

    const handleBackButtonClick = () => {
        rpcClient.getMiVisualizerRpcClient().goBack();
    };


    const handleCreateMediator = async (values: InputsFields) => {
        const request = {
            projectDirectory: props.path,
            packageName: values.packageName,
            className: values.className
        };
        const response = await rpcClient.getMiDiagramRpcClient().createClassMediator(request);
        if (response) {
            rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Overview } });
            rpcClient.getMiDiagramRpcClient().openFile(response);
            rpcClient.getMiDiagramRpcClient().closeWebView();
        }
    }

    return (
        <FormView title="Create Class Mediator" onClose={handleBackButtonClick}>
            <TextField
                id='package-input'
                label="Package Name"
                errorMsg={errors.packageName?.message}
                {...register("packageName")}
            />
            <TextField
                id='class-input'
                label="Class Name"
                errorMsg={errors.className?.message}
                {...register("className")}
            />
            <br />
            <FormActions>
                <Button appearance="secondary" onClick={openOverview}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit((values) => {
                    handleCreateMediator(values);
                })}>
                    Create
                </Button>
            </FormActions>
        </FormView>

    );
}
