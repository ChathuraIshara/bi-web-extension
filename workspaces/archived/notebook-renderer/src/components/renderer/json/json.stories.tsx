import React from 'react';
import { Attributes, ComponentChildren, h, Ref } from 'preact';
import { Meta } from '@storybook/react';
import { JsonForNotebookOutput } from './json';
import { NotebookCellResult } from '../types';

export default {
    component: JsonForNotebookOutput,
    title: 'Components/Json',
} as Meta;

const Template = (args: JSX.IntrinsicAttributes & { notebookCellOutput: Readonly<NotebookCellResult>; }
    & Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>) => <JsonForNotebookOutput {...args} />;

export const SimpleJson1 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `{"username":"Jake","salary":100,"fullname":{"firstname":"jake","lastname":"Peralta"}}`,
                mimeType: 'json',
                type: 'json'
            }
        }
    },
};

export const SimpleJson2 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {"username":"John","salary":100},
                    {"username":"Adam","salary":300},
                    {"username":"Jake","salary":100}
                ]`,
                mimeType: 'ballerina-notebook/json-view',
                type: 'json'
            }
        }
    },
};

export const SimpleJson3 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {"username":"John","salary":100,"fullname":{"firstname":"John","lastname":"Doe"}},
                    {"username":"Adam","salary":300,"fullname":{"firstname":"Adam","lastname":"Smith"}},
                    {"username":"Jake","salary":100,"fullname":{"firstname":"jake","lastname":"Peralta"}}
                ]`,
                mimeType: 'ballerina-notebook/json-view',
                type: 'json'
            }
        }
    },
};

export const SimpleJson4 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: JSON.stringify({
                    "objectAttribute": {
                        "Attribute": "value",
                        "urlAttribute": "https://dummy.com/dummy"
                    },
                    "stringAttribute": "**Description:** ``` function test() returns int {  returns 10; } ```",
                    "HTMLAttribute": "<p dir=\"auto\"><strong>Description:</strong></p> <p dir=\"auto\">Some description</p> <div class=\"highlight overflow-auto\"></div>",
                    "BoolAttribute": false,
                    "nullAttribute": null,
                    "intAttribute": 365591912,
                    "floatAttribute": 3655.91912,
                }),
                mimeType: 'ballerina-notebook/json-view',
                type: 'json'
            }
        }
    },
};

export const SimpleArray = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: JSON.stringify([
                    1,
                    false,
                    null,
                    "foo",
                    {
                        "first": "John",
                        "last": "Doe"
                    },
                    {
                        string: 'this is a test string',
                        integer: 42,
                        empty_array: [],
                        empty_object: {},
                        array: [1, 2, 3, 'test'],
                        float: -2.757,
                        undefined_var: undefined,
                        parent: {
                            sibling1: true,
                            sibling2: false,
                            sibling3: null
                        },
                        string_number: '1234'
                    }
                ]),
                mimeType: 'ballerina-notebook/json-view',
                type: 'json'
            }
        }
    },
};


