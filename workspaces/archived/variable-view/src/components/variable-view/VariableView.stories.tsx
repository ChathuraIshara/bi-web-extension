import React from 'react';
import { storiesOf } from '@storybook/react';
import { VariableValue, VariableView } from './VariableView';

const getVariableValues = (): Promise<VariableValue[]> => {
    return Promise.resolve([{
        name: "x",
        type: "int",
        value: "10"
    },
    {
        name: "b",
        type: "string",
        value: "hello world"
    },
    {
        name: "result",
        type: "int|error",
        value: "error(\"{ballerina}DivisionByZero\",message=\" / by zero\")"
    },
    {
        name: "tableData",
        type: "table<Employee> key(username)",
        value: "table key(username) [{\"username\":\"John\",\"salary\":100,\"fullname\":{\"firstname\":\"John\",\"lastname\":\"Doe\"}},{\"username\":\"Adam\",\"salary\":300,\"fullname\":{\"firstname\":\"Adam\",\"lastname\":\"Smith\"}},{\"username\":\"Jake\",\"salary\":100,\"fullname\":{\"firstname\":\"jake\",\"lastname\":\"Peralta\"}}]"
    }]);
}

const target: HTMLElement = document.createElement("div");

storiesOf("Variable view", module)
    .add("Variable view table", () => (
        <VariableView getVariableValues={getVariableValues} container={target} />
    ));
