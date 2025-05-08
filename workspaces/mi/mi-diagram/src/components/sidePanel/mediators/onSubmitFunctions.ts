/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { EVENT_TYPE, MACHINE_VIEW } from '@wso2-enterprise/mi-core';
import { RUNTIME_VERSION_440 } from '../../../resources/constants';
import { compareVersions } from '../../../utils/commons';

export function createAndopenDataMapper(documentUri: string, formValues: { [key: string]: any; }, rpcClient: any, runtimeVersion: string) {
    const configName = formValues.name;

    const isResourceContentUsed = compareVersions(runtimeVersion, RUNTIME_VERSION_440) >= 0;
    const localPathPrefix = isResourceContentUsed ? 'resources' : 'gov';
    const configurationLocalPath = localPathPrefix + ':/datamapper/' + configName + '/' + configName + '.dmc';
    return () => {

        const request = {
            sourcePath: documentUri,
            regPath: configurationLocalPath
        };
        if (configName === "") {
            return;
        }
        const dmCreateRequest = {
            dmLocation: "",
            filePath: documentUri,
            dmName: configName
        };
        rpcClient.getMiDataMapperRpcClient().convertRegPathToAbsPath(request).then((response: any) => {
            rpcClient.getVisualizerState().then((state: any) => {
                rpcClient.getMiVisualizerRpcClient().openView({
                    type: EVENT_TYPE.OPEN_VIEW,
                    location: {
                        ...state,
                        documentUri: response.absPath,
                        view: MACHINE_VIEW.DataMapperView,
                        dataMapperProps: {
                            filePath: response.absPath,
                            configName: configName
                        }
                    }
                });
            });
        });
    };
}
