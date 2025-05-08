/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Button, FormActions, FormView } from "@wso2-enterprise/ui-toolkit";
import { Keylookup } from "@wso2-enterprise/mi-diagram";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MockServiceForm } from "./MockServiceForm";

export interface SelectMockServiceProps {
    name?: string;
    availableMockServices?: string[];
    isWindows: boolean;
    onGoBack: () => void;
    onSubmit: (values: any) => void;
}


export function SelectMockService(props: SelectMockServiceProps) {
    const isUpdate = !!props.name;
    const [showAddMockService, setShowAddMockService] = useState(false);

    // Schema
    const schema = yup.object({
        name: yup.string().required("Test case name is required").notOneOf(props.availableMockServices, "Mock service already added"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    useEffect(() => {
        reset({ name: props.name });
    }, []);

    const submitForm = async (values: any) => {
        props.onSubmit(values);
    }

    const handleGoBack = () => {
        props.onGoBack();
    }

    if (showAddMockService) {
        return <MockServiceForm onGoBack={handleGoBack} onSubmit={submitForm} availableMockServices={props.availableMockServices} isWindows={props.isWindows}/>
    }

    return (
        <FormView title={`${isUpdate ? "Update" : "Add"} Mock Service`} onClose={handleGoBack}>
            <div style={{ height: "50vh" }}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Keylookup
                            value={field.value}
                            filterType='mockService'
                            label="Select Mock Service"
                            errorMsg={errors.name?.message}
                            allowItemCreate={true}
                            onCreateButtonClick={() => {
                                setShowAddMockService(true);
                            }}
                            onValueChange={field.onChange}
                        />
                    )}
                />
            </div>
            <FormActions>
                <Button
                    appearance="primary"
                    onClick={handleSubmit(submitForm)}
                >
                    {`${isUpdate ? "Update" : "Add"}`}
                </Button>
                <Button appearance="secondary" onClick={handleGoBack}>
                    Cancel
                </Button>
            </FormActions>
        </FormView>
    );
}
