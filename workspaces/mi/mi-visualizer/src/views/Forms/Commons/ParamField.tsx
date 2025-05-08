/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from '@emotion/styled';
import { CheckBox, Dropdown, TextField } from '@wso2-enterprise/ui-toolkit';

const Container = styled.div({
    marginBottom: "20px",
})

const ParamField = ({ field, id, stateValue, handleOnChange, handleOnError }: any) => {
    const { name, type, value, items } = field;

    const getParameterName = (id: string) => {
        return id.split(".").map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    return (
        <Container>
            {type === "text" ? (
                <TextField
                    value={stateValue ?? value ?? ""}
                    id={id}
                    label={name ?? getParameterName(id)}
                    onTextChange={(text: string) => handleOnChange(id, text)}
                    errorMsg={handleOnError ? handleOnError(id) : undefined}
                />
            ) : type === "checkbox" ? (
                <CheckBox
                    label={name ?? getParameterName(id)}
                    value={stateValue ?? value}
                    checked={!!stateValue ?? !!value}
                    onChange={(checked: boolean) => handleOnChange(id, checked)}
                />
            ) : type === "dropdown" ? (
                <>
                    <span>{name ?? getParameterName(id)}</span>
                    <Dropdown
                        id={id}
                        value={stateValue ?? value}
                        onValueChange={(text: string) => handleOnChange(id, text)}
                        items={items}
                    />
                </>
            ) : <></>}
        </Container>
    );
};

export default ParamField;
