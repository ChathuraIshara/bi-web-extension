/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FormActions, Button, ErrorBanner } from "@wso2-enterprise/ui-toolkit";
import React, { useContext } from "react";
import FormGenerator from "../../Form/FormGenerator";
import styled from "@emotion/styled";
import { sidepanelGoBack } from "..";
import SidePanelContext, { clearSidePanelState } from "../SidePanelContexProvider";
import { useVisualizerContext, } from "@wso2-enterprise/mi-rpc-client";
import { GetMediatorResponse } from "@wso2-enterprise/mi-core";
import { Range } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { ERROR_MESSAGES } from "../../../resources/constants";
import { createAndopenDataMapper } from "./onSubmitFunctions";

export interface MediatorFormProps {
    control: any;
    errors: any;
    setValue: any;
    reset: any;
    watch: any;
    getValues: any;
    dirtyFields: any;
    handleSubmit: any;
    mediatorData: GetMediatorResponse
    mediatorType: string;
    isUpdate: boolean;
    documentUri: string;
    range: Range
}

const FormContainer = styled.div`
    width: 100%;
`;
export function MediatorForm(props: MediatorFormProps) {
    const { control, errors, setValue, reset, watch, getValues, dirtyFields, handleSubmit, mediatorData, mediatorType, isUpdate, documentUri, range } = props;
    const { rpcClient, setIsLoading: setDiagramLoading } = useVisualizerContext();
    const sidePanelContext = useContext(SidePanelContext);

    const handleOnSubmit = async (values: any) => {
        setDiagramLoading(true);
        for (const key in values) {
            // Handle paramerter manager
            if (Array.isArray(values[key])) {
                values[key] = values[key].map((item: any) => {
                    const extractValues: any = (obj: any) => {
                        return Object.values(obj).map((value: any) =>
                            Array.isArray(value) ? value.map((subItem: any) =>
                                (subItem instanceof Object) ? extractValues(subItem) : subItem
                            ) : value
                        );
                    };
                    return extractValues(item);
                });
            }
        }
        rpcClient.getMiDiagramRpcClient().updateMediator({
            mediatorType: mediatorType,
            values: values as Record<string, any>,
            oldValues: sidePanelContext.formValues as Record<string, any>,
            dirtyFields: Object.keys(dirtyFields),
            documentUri,
            range
        });

        if (mediatorData.onSubmit) {
            switch (mediatorData.onSubmit) {
                case "openDataMapperEditor":
                    if (sidePanelContext?.newDataMapperName === values.name) {
                        const projectDetails = await rpcClient.getMiVisualizerRpcClient().getProjectDetails();
                        const runtimeVersion = await projectDetails.primaryDetails.runtimeVersion.value;
                        createAndopenDataMapper(documentUri, values, rpcClient, runtimeVersion)();
                    }
                    break;
            }
        }

        clearSidePanelState(sidePanelContext);
    }

    const handleOnClose = () => {
        sidePanelContext.pageStack.length > 1 ? sidepanelGoBack(sidePanelContext) : clearSidePanelState(sidePanelContext);
    }

    if (!mediatorData) {
        return <ErrorBanner
            errorMsg={ERROR_MESSAGES.ERROR_LOADING_MEDIATORS}
        />
    }

    return (
        <FormContainer>
            <FormGenerator
                formData={mediatorData}
                control={control}
                errors={errors}
                setValue={setValue}
                reset={reset}
                watch={watch}
                getValues={getValues}
                skipGeneralHeading={true}
                range={range}
            />
            <FormActions>
                <Button
                    appearance="secondary"
                    onClick={handleOnClose}
                >
                    Cancel
                </Button>
                <Button
                    appearance="primary"
                    onClick={handleSubmit(handleOnSubmit)}
                    disabled={isUpdate && Object.keys(dirtyFields).length === 0}
                >
                    {isUpdate ? "Update" : "Add"}
                </Button>
            </FormActions>
        </FormContainer>);
}
