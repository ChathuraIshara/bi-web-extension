/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { TextField, Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import PropTable from "./PropTable";
import { useState } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

const Container = styled.div`
    padding: 15px 30px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
`;

const ClassName = styled.div({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
});

const TitleBar = styled.div({
    display: 'grid',
    gridTemplateColumns: '1fr 20px 20px 20px 60px 110px',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
});

type HandlerBaseProps = {
    handlerId: number;
    last: number;
    handler: any;
}

type HandlerProps = HandlerBaseProps & {
    handlers: any[];
    onChangeHandlers: (handlers: any) => void;
}

type FormHandlerProps<T extends FieldValues> = HandlerBaseProps & UseControllerProps<T>;

const Handler = ({ handlerId, last, handler, handlers, onChangeHandlers }: HandlerProps) => {
    const [showProps, setShowProps] = useState(false);

    const onClassNameChange = (text: string) => {
        const newHandlers = [...handlers];
        newHandlers[handlerId] = { ...newHandlers[handlerId], name: text };
        onChangeHandlers(newHandlers);
    }

    const moveUp = () => {
        if (handlerId === 0) return;
        const newHandlers = [...handlers];
        const temp = newHandlers[handlerId];
        newHandlers[handlerId] = newHandlers[handlerId - 1];
        newHandlers[handlerId - 1] = temp;
        onChangeHandlers(newHandlers);
    }

    const moveDown = () => {
        if (handlerId === last) return;
        const newHandlers = [...handlers];
        const temp = newHandlers[handlerId];
        newHandlers[handlerId] = newHandlers[handlerId + 1];
        newHandlers[handlerId + 1] = temp;
        onChangeHandlers(newHandlers);
    }

    const onHandlerDelete = () => {
        const newHandlers = [...handlers];
        newHandlers.splice(handlerId, 1);
        onChangeHandlers(newHandlers);
    }

    const onPropertyAdd = () => {
        setShowProps(true);

        if (handler.properties.length === 0) {
            const newHandlers = [...handlers];
            newHandlers[handlerId].properties.push({ name: '', value: '' });
            onChangeHandlers(newHandlers);
            return;
        }

        const lastProp = handler.properties[handler.properties.length - 1];
        if (lastProp.name === '' || lastProp.value === '') return;

        const newHandlers = [...handlers];
        newHandlers[handlerId].properties.push({ name: '', value: '' });
        onChangeHandlers(newHandlers);
    }

    const onPropertiesChange = (properties: []) => {
        const newHandlers = [...handlers];
        newHandlers[handlerId] = { ...newHandlers[handlerId], properties: properties };
        onChangeHandlers(newHandlers);
    }

    return (
        <Container>
            <TitleBar>
                <ClassName>
                    <b>Class Name</b>
                    <TextField
                        id='class-name'
                        value={handler.name}
                        placeholder="Class name"
                        onTextChange={(text: string) => onClassNameChange(text)}
                        sx={{ flexGrow: 1 }}
                    />
                </ClassName>
                <Codicon iconSx={{ fontSize: 18 }} name='arrow-down' onClick={moveDown} />
                <Codicon iconSx={{ fontSize: 18 }} name='arrow-up' onClick={moveUp} />
                <Codicon iconSx={{ fontSize: 18 }} name='trash' onClick={onHandlerDelete} />
                <Button
                    appearance="secondary"
                    onClick={() => setShowProps(!showProps)}
                >
                    {showProps ? "Hide" : "Show"}
                </Button>
                <Button
                    appearance="primary"
                    onClick={onPropertyAdd}
                >
                    Add Property
                </Button>
            </TitleBar>
            {showProps && <PropTable classId={handlerId} properties={handler.properties} onPropertiesChange={onPropertiesChange} />}
        </Container>
    )
}

export default Handler;

export const FormHandler = <T extends FieldValues>({ handlerId: id, last, handler, name, control }: FormHandlerProps<T>) => {
    const {
        field: { value, onChange }
    } = useController({ name, control });

    return (
        <Handler
            handlerId={id}
            last={last}
            handler={handler}
            handlers={value}
            onChangeHandlers={onChange}
        />
    );
};

