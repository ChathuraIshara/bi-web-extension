/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

export interface BallerinaModuleProps {
    path: string;
}

type InputsFields = {
    moduleName?: string;
    version?: string;
};

const initialBallerinaModule: InputsFields = {
    moduleName: "",
    version: ""
};

const schema = yup.object({
    moduleName: yup.string()
        .required("Module Name is required")
        .matches(/^([a-zA-Z_$][a-zA-Z\d_$]*\.)*[a-zA-Z_$][a-zA-Z\d-_$]*$/, "Invalid Module Name"),
    version: yup.string()
        .required("Version is required")
        .matches(/^[a-zA-Z\d_$-\.]*$/, "Invalid Version")
});

export function BallerinaModuleForm(props: BallerinaModuleProps) {

    const { rpcClient } = useVisualizerContext();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: initialBallerinaModule,
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    const openOverview = () => {
        rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Overview } });
    };

    const handleBackButtonClick = () => {
        rpcClient.getMiVisualizerRpcClient().goBack();
    };


    const handleCreateModule = async (values: InputsFields) => {
        const request = {
            projectDirectory: props.path,
            moduleName: values.moduleName,
            version: values.version
        };
        console.log(request);
        const response = await rpcClient.getMiDiagramRpcClient().createBallerinaModule(request);
        console.log("Response: ", response);
        if (response) {
            rpcClient.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Overview } });
            rpcClient.getMiDiagramRpcClient().openFile(response);
            rpcClient.getMiDiagramRpcClient().closeWebView();
        }
    }

    return (
        <FormView title="Create Ballerina Module" onClose={handleBackButtonClick}>
            <TextField
                id='name-input'
                label="Module Name"
                errorMsg={errors.moduleName?.message}
                required
                {...register("moduleName")}
            />
            <TextField
                id='version-input'
                label="Version"
                errorMsg={errors.version?.message}
                required
                {...register("version")}
            />
            <br />
            <FormActions>
                <Button appearance="secondary" onClick={openOverview}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit(handleCreateModule)}>
                    Create
                </Button>
            </FormActions>
        </FormView>

    );
}
