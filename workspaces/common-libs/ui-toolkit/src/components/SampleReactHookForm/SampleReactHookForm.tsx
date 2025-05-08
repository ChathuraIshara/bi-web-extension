/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { useForm } from "react-hook-form";
import { TextField } from "../TextField/TextField";
import { Dropdown } from "../Dropdown/Dropdown";
import { TextArea } from "../TextArea/TextArea";
import { Button } from "../Button/Button";
import styled from "@emotion/styled";
import { FormAutoComplete } from "../AutoComplete/AutoComplete";
import { RadioButtonGroup } from "../RadioButtonGroup/RadioButtonGroup";
import { FormCheckBox } from "../CheckBoxGroup/CheckBoxGroup";
import { FormLocationSelector } from "../LocationSelector/LocationSelector";
import { PasswordField } from "../PasswordField/PasswordField";

type Inputs = {
    name: string;
    products: string;
    address: string;
    words: string;
    options: string;
    isRegistered: boolean;
    password: string;
    selectedFile: string;
};

export interface SampleReactHookFormProps {
    id: string;
    args?: Inputs
}

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export function SampleReactHookForm(props: SampleReactHookFormProps) {
    const { id, args } = props;
    const {
        getValues,
        register,
        control
    } = useForm<Inputs>({
        defaultValues: args,
    });

    const handleSave = () => {
        console.log(getValues());
    };
    return (
        <FormContainer id={id}>
            <TextField
                label="Name"
                id="name"
                {...register("name")}
            />
            <Dropdown
                items= {[{ id: "product-1", content: "Product 1", value: "pro1" }, { id: "product-2", content: "Product 2", value: "pro2" }, { id: "product-3", content: "Product 3", value: "pro3" }]}
                id={"Age"}
                label="Age"
                {...register("products")}
            />
            <TextArea
                label="Address"
                id="address"
                {...register("address")}
            />
            <FormAutoComplete
                label="Words"
                required={true}
                isNullable={true}
                items={["foo", "boo"]}
                control={control}
                {...register("words")}
            />
            <RadioButtonGroup
                id="options"
                label="Options"
                options={[{ content: "Option 1", value: "option1" }, { content: "Option 2", value: "option2" }]}
                {...register("options")}
            />

            <FormCheckBox
                name="isRegistered"
                label="Is Registered?"
                control={control}
            />
            <PasswordField
                label="Password"
                showPassword={false}
                {...register("password")}
            />
            <FormLocationSelector
                name="selectedFile"
                label="Select File"
                control={control}
                onSelect={() => console.log("File selected")}
                btnText="Browse"
                required={true}
            />
            <Button appearance="primary" onClick={handleSave}> Save </Button>
        </FormContainer>
    );
}
