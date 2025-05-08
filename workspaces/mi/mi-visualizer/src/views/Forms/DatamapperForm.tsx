/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from "react";
import { Button, FormGroup, TextField, FormView, FormActions, Dropdown, OptionProps } from "@wso2-enterprise/ui-toolkit";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import { EVENT_TYPE, MACHINE_VIEW, POPUP_EVENT_TYPE } from "@wso2-enterprise/mi-core";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { compareVersions } from "@wso2-enterprise/mi-diagram/lib/utils/commons";
import { RUNTIME_VERSION_440 } from "../../constants";

export interface DatamapperFormProps {
    path: string;
    isPopup?: boolean;
    handlePopupClose?: () => void;
}

type InputsFields = {
    name?: string;
};

const initialSequence: InputsFields = {
    name: ""
};

const MappingTypes: OptionProps[] = [
    { value: "json", content: "JSON" },
    { value: "xml", content: "XML" },
    { value: "csv", content: "CSV" }
];

export function DatamapperForm(props: DatamapperFormProps) {
    const { rpcClient } = useVisualizerContext();
    const [workspaceFileNames, setWorkspaceFileNames] = useState([]);

    const isNewTemplate = !props?.path?.endsWith(".xml");

    const schema = yup.object({
        name: yup.string().required("Mapping file name is required").matches(/^[a-zA-Z0-9_-]*$/, "Invalid characters in sequence name")
            .test('validateDatamapperName',
                'An artifact with same name already exists', value => {
                    return !workspaceFileNames.includes(value)
                })
    });

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isDirty },
    } = useForm<InputsFields>({
        defaultValues: initialSequence,
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        (async () => {
            const artifactRes = await rpcClient!.getMiDiagramRpcClient().getAvailableResources({
                documentIdentifier: props.path,
                resourceType: "dataMapper"
            });
            setWorkspaceFileNames(artifactRes.registryResources.map((resource: any) => resource.name.replace(/\.ts$/, "")));
        })();
    }, []);

    const handleCreateDatamapper = async () => {
        const projectDetails = await rpcClient.getMiVisualizerRpcClient().getProjectDetails();
        const runtimeVersion = projectDetails.primaryDetails.runtimeVersion.value;
        const isResourceContentUsed = compareVersions(runtimeVersion, RUNTIME_VERSION_440) >= 0;
        const localPathPrefix = isResourceContentUsed ? 'resources' : 'gov';
        const configName = getValues("name");
        if (configName === "") {
            return;
        }

        const configurationLocalPath = localPathPrefix + ':/datamapper/' + configName + '/' + configName + '.dmc';
        const dataMapperIdentifier = localPathPrefix + ':datamapper/' + configName;
        const request = {
            sourcePath: props.path,
            regPath: configurationLocalPath
        };
        const dmCreateRequest = {
            dmLocation: "",
            filePath: props.path,
            dmName: configName
        };
        const response = await rpcClient.getMiDataMapperRpcClient().createDMFiles(dmCreateRequest);
        const responseAbsPath = await rpcClient.getMiDataMapperRpcClient().convertRegPathToAbsPath(request);
        const state = await rpcClient.getVisualizerState();
        if (props.isPopup) {
            rpcClient.getMiVisualizerRpcClient().openView({
                type: POPUP_EVENT_TYPE.CLOSE_VIEW,
                location: { view: null, recentIdentifier: dataMapperIdentifier },
                isPopup: true
            });
        } else {
            rpcClient.getMiVisualizerRpcClient().openView({
                type: EVENT_TYPE.OPEN_VIEW,
                location: {
                    ...state,
                    documentUri: responseAbsPath.absPath,
                    view: MACHINE_VIEW.DataMapperView,
                    dataMapperProps: {
                        filePath: responseAbsPath.absPath,
                        configName: configName
                    }
                }
            });
        }
    }

    const handleCancel = () => {
        props.handlePopupClose ? props.handlePopupClose() : rpcClient!.getMiVisualizerRpcClient().openView({ type: EVENT_TYPE.OPEN_VIEW, location: { view: MACHINE_VIEW.Overview } });
    };

    const handleBackButtonClick = () => {
        props.handlePopupClose ? props.handlePopupClose() : rpcClient!.getMiVisualizerRpcClient().goBack();
    }

    return (
        <FormView title={isNewTemplate ? "Create New Datamapper" : "Update Datamapper"} onClose={handleBackButtonClick} >
            <TextField
                id='name-input'
                label="Name"
                placeholder="Name"
                errorMsg={errors.name?.message?.toString()}
                {...register("name")}
            />

            <FormActions>
                <Button
                    appearance="secondary"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    appearance="primary"
                    disabled={!isDirty}
                    onClick={handleSubmit(handleCreateDatamapper)}
                >
                    {isNewTemplate ? "Create" : "Save Changes"}
                </Button>
            </FormActions>
        </FormView>
    );
}
