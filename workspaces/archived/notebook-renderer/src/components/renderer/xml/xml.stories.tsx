import React from 'react';
import { Attributes, ComponentChildren, Ref } from 'preact';
import { Meta } from '@storybook/react';
import { Xml } from './xml';
import { NotebookCellResult } from '../types';

export default {
    component: Xml,
    title: 'Components/Xml',
} as Meta;

const Template = (args: JSX.IntrinsicAttributes & { notebookCellOutput: Readonly<NotebookCellResult>; } 
    & Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>) => <Xml {...args} />;

export const SimpleXml1 = {
    args: {
        notebookCellOutput:{
            shellValue: {
                value: `<hello>World</hello>`,
                mimeType: 'xml',
                type: 'xml'
            }
        }
    },
};

export const SimpleXml2 = {
    args: {
        notebookCellOutput:{
            shellValue: {
                value: `<note>
                    <to>Jane</to>
                    <from>Jon</from>
                    <!-- <comment> some comment </comment> -->
                    <heading>Reminder</heading>
                    <![CDATA[<foo></bar>]]>
                    <body attr="Attribute value">Hello World!</body>
                </note>
                `,
                mimeType: 'xml',
                type: 'xml'
            }
        }
    },
};
