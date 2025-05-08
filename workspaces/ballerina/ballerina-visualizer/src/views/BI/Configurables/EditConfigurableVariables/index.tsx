/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from '@emotion/styled';
import { ConfigVariable, EVENT_TYPE, MACHINE_VIEW } from '@wso2-enterprise/ballerina-core';
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";
import { PanelContainer, FormValues } from '@wso2-enterprise/ballerina-side-panel';
import FormGenerator from '../../Forms/FormGenerator';

namespace S {
    export const FormContainer = styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: inherit;
    `;
}

export interface ConfigFormProps {
    isOpen: boolean;
    onClose?: () => void;
    variable: ConfigVariable;
    title: string;
    filename: string;
}

export function EditForm(props: ConfigFormProps) {
    const { isOpen, onClose, variable, title, filename } = props;

    const { rpcClient } = useRpcContext();

    const handleSave = (data: FormValues) => {
        variable.properties.defaultable.value =
            data.properties.defaultable.value === "" || data.properties.defaultable.value === null ?
                "?"
                : data.properties.defaultable.value;
        variable.properties.type.value = data.properties.type.value;
        variable.properties.variable.value = data.properties.variable.value;

        rpcClient
            .getBIDiagramRpcClient()
            .updateConfigVariables({
                configVariable: variable,
                configFilePath: filename
            })
            .then((response: any) => {
                console.log(">>> Config variables------", response);
            })
            .finally(() => {
                if (onClose) {
                    onClose();
                } else {
                    goToViewConfig();
                }
            });
    };

    const goToViewConfig = () => {
        rpcClient.getVisualizerRpcClient().openView({
            type: EVENT_TYPE.OPEN_VIEW,
            location: {
                view: MACHINE_VIEW.ViewConfigVariables,
            },
        });
    };

    return (
        <>
            <PanelContainer
                title={title}
                show={isOpen}
                onClose={onClose ? onClose : goToViewConfig}
            >
                <FormGenerator
                    fileName={filename}
                    node={variable}
                    targetLineRange={{
                        startLine: variable.codedata.lineRange.startLine,
                        endLine: variable.codedata.lineRange.endLine
                    }}
                    onSubmit={handleSave}
                />
            </PanelContainer>
        </>
    );
}

export default EditForm;
