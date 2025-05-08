import React from 'react';
import { Attributes, ComponentChildren, Ref } from 'preact';
import { Meta } from '@storybook/react';
import { TableForNotebookOutput } from './table';
import { NotebookCellResult } from '../types';

export default {
    component: TableForNotebookOutput,
    title: 'Components/Table',
} as Meta;

const Template = (args: JSX.IntrinsicAttributes & { notebookCellOutput: Readonly<NotebookCellResult>; }
    & Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>) => <TableForNotebookOutput {...args} />;

export const EmptyTable = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[]`,
                mimeType: 'table',
                type: 'table'
            }
        }
    },
};

export const SimpleTable1 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {"username":"John","salary":100},
                    {"username":"Adam","salary":300},
                    {"username":"Jake","salary":100}
                ]`,
                mimeType: 'table',
                type: 'table'
            }
        }
    },
};

export const SimpleTable2 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {"username":"John","salary":100,"fullname":{"firstname":"John","lastname":"Doe"}},
                    {"username":"Adam","salary":300,"fullname":{"firstname":"Adam","lastname":"Smith"}},
                    {"username":"Jake","salary":100,"fullname":{"firstname":"jake","lastname":"Peralta"}}
                ]`,
                mimeType: 'table',
                type: 'table'
            }
        }
    },
};

export const SimpleTable3 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {
                        "username":"John",
                        "salary":100,
                        "fullname":{
                            "firstname":"John",
                            "lastname":"Doe"
                        },
                        "friends":[
                            {
                                "username":"Adam",
                                "salary":300,
                                "fullname":{
                                    "firstname":"Adam",
                                    "lastname":"Smith"
                                }
                            },
                            {
                                "username":"Jake",
                                "salary":100,
                                "fullname":{
                                    "firstname":"jake",
                                    "lastname":"Peralta"
                                }
                            }
                        ]
                    },
                    {
                        "username":"Adam",
                        "salary":300,
                        "fullname":{
                            "firstname":"Adam",
                            "lastname":"Smith"
                        },
                        "friends":[
                            {
                                "username":"John",
                                "salary":100,
                                "fullname":{
                                    "firstname":"John",
                                    "lastname":"Doe"
                                }
                            },
                            {
                                "username":"Jake",
                                "salary":100,
                                "fullname":{
                                    "firstname":"jake",
                                    "lastname":"Peralta"
                                }
                            }
                        ]
                    },
                    {
                        "username":"Jake",
                        "salary":100,
                        "fullname":{
                            "firstname":"jake",
                            "lastname":"Peralta"
                        },
                        "friends":[
                            {
                                "username":"John",
                                "salary":100,
                                "fullname":{
                                    "firstname":"John",
                                    "lastname":"Doe"
                                }
                            },
                            {
                                "username":"Adam",
                                "salary":300,
                                "fullname":{
                                    "firstname":"Adam",
                                    "lastname":"Smith"
                                }
                            }
                        ]
                    }
                ]`,
                mimeType: 'table',
                type: 'table'
            }
        }
    },
};

export const InconsistentTable1 = {
    args: {
        notebookCellOutput: {
            shellValue: {
                value: `[
                    {"username":"John","salary":100,"region":"LA"},
                    {"username":"Adam","salary":300,"title":"Manager"},
                    {"username":"Jake","salary":100,"region":""}
                ]`,
                mimeType: 'table',
                type: 'table'
            }
        }
    },
};
