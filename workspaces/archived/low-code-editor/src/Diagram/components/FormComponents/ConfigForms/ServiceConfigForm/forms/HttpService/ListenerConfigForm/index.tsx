/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText } from "@material-ui/core";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import CheckBoxGroup from "../../../../../FormFieldComponents/CheckBox";
import { SelectDropdownWithButton } from "../../../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { LowCodeExpressionEditor } from "../../../../../FormFieldComponents/LowCodeExpressionEditor";
import { VariableNameInput } from "../../../../Components/VariableNameInput";
import { wizardStyles as useFormStyles } from "../../../../style";
import { ListenerConfigFormState, ServiceConfigActions, ServiceConfigActionTypes } from "../util/reducer";

interface ListenerConfigFormProps {
    configState: ListenerConfigFormState
    actionDispatch: (action: ServiceConfigActions) => void;
    listenerList: string[];
    targetPosition: NodePosition;
}

// FixMe: show validation messages to listenerName and listenerPort
export function ListenerConfigForm(props: ListenerConfigFormProps) {
    const formClasses = useFormStyles();
    const { configState: state, actionDispatch, listenerList, targetPosition } = props;

    const listenerSelectionCustomProps = {
        disableCreateNew: false, values: listenerList || [],
    }

    const handleListenerDefModeChange = (mode: string[]) => {
        if (listenerList.length === 0) {
            actionDispatch({ type: ServiceConfigActionTypes.CREATE_NEW_LISTENER });
        }
        actionDispatch({ type: ServiceConfigActionTypes.DEFINE_LISTENER_INLINE, payload: mode.length === 0 })
    }

    const onListenerNameChange = (listenerName: string) => {
        actionDispatch({ type: ServiceConfigActionTypes.SET_LISTENER_NAME, payload: listenerName })
    }

    const onListenerPortChange = (listenerPort: string) => {
        actionDispatch({ type: ServiceConfigActionTypes.SET_LISTENER_PORT, payload: listenerPort })
    }

    const onListenerSelect = (listenerName: string) => {
        if (listenerName === 'Create New') {
            actionDispatch({ type: ServiceConfigActionTypes.CREATE_NEW_LISTENER });
        } else {
            actionDispatch({ type: ServiceConfigActionTypes.SELECT_EXISTING_LISTENER, payload: listenerName });
        }
    }

    const validateField = (fieldName: string, isInvalidFromField: boolean) => {
        actionDispatch({ type: ServiceConfigActionTypes.UPDATE_INVALID_CONFIG_STATUS, payload: isInvalidFromField });
    }

    const listenerSelector = (
        <>
            <FormHelperText className={formClasses.inputLabelForRequired}>
                <FormattedMessage
                    id="lowcode.develop.connectorForms.HTTP.selectlListener"
                    defaultMessage="Select Listener :"
                />
            </FormHelperText>
            <SelectDropdownWithButton
                customProps={listenerSelectionCustomProps}
                onChange={onListenerSelect}
                placeholder="Select Property"
                defaultValue={!state.createNewListener ? state.listenerName : 'Create New'}
            />
        </>
    );

    const listenerNameInputComponent = (
        <VariableNameInput
            displayName="Listener Name"
            isEdit={false}
            onValueChange={onListenerNameChange}
            validateExpression={validateField}
            position={{
                startLine: targetPosition.startLine,
                endLine: targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            }}
            value={state.listenerName}
        />
    )

    const portNumberExpressionEditorProps: FormElementProps = {
        model: {
            name: "listenerPort",
            displayName: "Listener Port",
            typeName: "int"
        },
        customProps: {
            validate: validateField,
            interactive: true,
            statementType: 'int',
            editPosition: {
                startLine: targetPosition.startLine,
                endLine: targetPosition.startLine,
                startColumn: 0,
                endColumn: 0
            }
        },
        onChange: onListenerPortChange,
        defaultValue: state.listenerPort
    };

    const listenerPortInputComponent = (
        <LowCodeExpressionEditor
            {...portNumberExpressionEditorProps}
        />
    )

    return (
        <>
            <CheckBoxGroup
                values={["Define Inline"]}
                defaultValues={state.fromVar ? [] : ['Define Inline']}
                onChange={handleListenerDefModeChange}
            />
            {state.fromVar && listenerSelector}
            {state.fromVar && state.createNewListener && [listenerNameInputComponent, listenerPortInputComponent]}
            {!state.fromVar && listenerPortInputComponent}
        </>
    )
}
