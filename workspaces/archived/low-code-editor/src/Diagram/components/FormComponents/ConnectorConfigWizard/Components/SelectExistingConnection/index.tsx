/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import { FormattedMessage } from "react-intl";

import { FormControl, FormHelperText } from "@material-ui/core";
import { Connector, ConnectorConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { CaptureBindingPattern, LocalVarDecl } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";

import { matchEndpointToFormField } from "../../../../Portals/utils";
import { useStyles } from "../../../DynamicConnectorForm/style";
import { SelectDropdownWithButton } from "../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { wizardStyles } from "../../style";

interface SelectConnectionFormProps {
    onSelectExisting?: (value: any) => void;
    onCreateNew?: () => void;
    connectorConfig?: ConnectorConfig;
    connector: Connector;
}

export function SelectConnectionForm(props: SelectConnectionFormProps) {
    const { onCreateNew, connectorConfig, onSelectExisting } = props;
    const classes = useStyles();
    const wizardClasses = wizardStyles();
    const connections: LocalVarDecl[] = connectorConfig.existingConnections;

    const getValues = () => {
        return connections.map((conn) => (conn.typedBindingPattern.bindingPattern as
            CaptureBindingPattern).variableName.value);
    };

    const onSelectConn = (val: any) => {
        const selectedConn = connections.find((conn) =>
            (conn.typedBindingPattern.bindingPattern as CaptureBindingPattern).variableName.value === val);
        connectorConfig.name = val;
        if (selectedConn) {
            matchEndpointToFormField(selectedConn, connectorConfig.connectorInit);
        }
        connectorConfig.isExistingConnection = (val !== undefined);
        onSelectExisting(val);
    };

    return (
        <div>
            <FormControl className={classNames(wizardClasses.configWizardAPIContainerAuto, wizardClasses.bottomRadius)}>
                <div className={classes.fullWidth}>
                    <FormHelperText className={classes.inputLabelForRequired}><FormattedMessage id="lowcode.develop.connectorForms.selectExistingConnection.title" defaultMessage="Select/Create Connection"/></FormHelperText>
                    <FormHelperText className={classes.starLabelForRequired}>*</FormHelperText>
                </div>
                <SelectDropdownWithButton
                    onChange={onSelectConn}
                    customProps={{ values: getValues() }}
                    defaultValue=""
                    onClick={onCreateNew}
                />
            </FormControl>
        </div>
    );
}
