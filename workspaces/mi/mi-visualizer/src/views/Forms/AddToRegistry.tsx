/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TextField, RadioButtonGroup } from "@wso2-enterprise/ui-toolkit";
import { RpcClient } from "@wso2-enterprise/mi-rpc-client";
import { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { CreateRegistryResourceRequest } from "@wso2-enterprise/mi-core";

export interface AddToRegistryProps {
    path: string;
    fileName: string;
    register: UseFormRegister<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

export async function saveToRegistry(rpcClient: RpcClient, path: string, registryType: string,
    fileName: string, content: string, registryPath: string, artifactName: string) {
    const regRequest: CreateRegistryResourceRequest = {
        projectDirectory: path,
        templateType: "Sequence",
        filePath: "",
        resourceName: fileName,
        artifactName: artifactName,
        registryPath: registryPath,
        registryRoot: registryType,
        createOption: "new",
        content: content,
    }
    return await rpcClient.getMiDiagramRpcClient().createRegistryResource(regRequest);
}

export function formatRegistryPath(path: string, registryType: string, fileName: string): string | undefined {
    if (!path || !fileName) return undefined;

    let regPath = '';
    if (registryType === 'gov') {
        regPath = regPath + 'gov';
    } else {
        regPath = regPath + 'conf';
    }
    path.startsWith('/') ? regPath = regPath + path : regPath = regPath + '/' + path;
    regPath.endsWith('/') ? regPath = regPath + fileName + '.xml' : regPath = regPath + '/' + fileName + '.xml';
    return regPath;
}

export async function getArtifactNamesAndRegistryPaths(path: string, rpcClient: RpcClient)
    : Promise<{ artifactNamesArr: string[], registryPaths: string[] }> {
    const artifactRes = await rpcClient.getMiDiagramRpcClient().getAvailableRegistryResources({
        path: path
    });
    const pathRes = await rpcClient.getMiDiagramRpcClient().getAllRegistryPaths({
        path: path,
    });
    return { artifactNamesArr: artifactRes.artifacts, registryPaths: pathRes.registryPaths };
}

export function AddToRegistry(props: AddToRegistryProps) {
    return (
        <div>
            <TextField
                id='artifactName'
                label="Artifact Name"
                errorMsg={props.errors.artifactName?.message.toString()}
                {...props.register("artifactName")}
            />
            <RadioButtonGroup
                label="Select registry type"
                id="registryType"
                options={[{ content: "Governance registry (gov)", value: "gov" }, { content: "Configuration registry (conf)", value: "conf" }]}
                {...props.register("registryType")}
            />
            <TextField
                id='registryPath'
                label="Registry Path"
                errorMsg={props.errors.registryPath?.message.toString()}
                {...props.register("registryPath")}
            />
        </div>
    );
};

export default AddToRegistry;
