/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

// tslint:disable-next-line:no-submodule-imports
import { Story } from '@storybook/react/types-6-0';

import { Provider as LowCodeEditorProvider } from "../../../../../../Contexts/Diagram";
import { FormState, Provider as EnumEditorProvider } from "../../../../../../Contexts/EnumEditor";
import { mockedEditorProps } from "../../ConditionConfigForms/ConditionsOverlayForm/AddWhileForm/index.stories";

import { Enumeration } from "./index";

export default {
    title: 'Low Code Editor/Testing/Form/Enumeration Editor/Enumeration',
    component: Enumeration,
};

const enumModel = {
    "name": "Organization",
    "fields": [{
        "name": "name",
        "type": "string",
        "isFieldOptional": false,
        "isFieldTypeOptional": false
    }, {"name": "id", "type": "int", "isFieldOptional": false, "isFieldTypeOptional": false}, {
        "name": "address",
        "fields": [{
            "name": "city",
            "type": "string",
            "isFieldOptional": false,
            "isFieldTypeOptional": false
        }, {"name": "province", "type": "string", "isFieldOptional": false, "isFieldTypeOptional": false}],
        "isInline": true,
        "type": "record",
        "isClosed": false
    }],
    "isInline": true,
    "type": "record",
    "isClosed": false,
    "isActive": true,
    "isPublic": false,
    "isTypeDefinition": true
}

const Template: Story<any> = (args: any) =>
    (
        <LowCodeEditorProvider {...mockedEditorProps} >
            <EnumEditorProvider
                state={{
                    enumModel,
                    currentForm: FormState.EDIT_RECORD_FORM,
                    currentEnum: enumModel,
                    sourceModel: null,
                }}
            >
                <Enumeration/>
            </EnumEditorProvider>
        </LowCodeEditorProvider>
    );

export const RecordComponent = Template.bind({});
