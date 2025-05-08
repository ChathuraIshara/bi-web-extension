/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
import { ActionButtons, Dropdown, SidePanelBody } from "@wso2-enterprise/ui-toolkit";
import { FunctionModel, ServiceModel } from "@wso2-enterprise/ballerina-core";

import { EditorContentColumn } from "../styles";

interface FunctionConfigFormProps {
    serviceModel: ServiceModel;
    onSubmit?: (model: FunctionModel) => void;
    onBack?: () => void;
}

export function FunctionConfigForm(props: FunctionConfigFormProps) {

    const { serviceModel, onSubmit, onBack } = props;

    const options = serviceModel.functions.filter(func => !func.enabled).map((func, index) => ({ id: index.toString(), value: func.name.value }));
    const [functionName, setFunctionName] = useState<string>(options.length > 0 ? options[0].value : undefined);

    const handleOnSelect = (value: string) => {
        setFunctionName(value);
    };

    const handleConfigSave = () => {
        const selectedFunction = serviceModel.functions.find(func => func.name.value === functionName);
        selectedFunction.enabled = true;
        onSubmit(selectedFunction);
    };

    return (
        <SidePanelBody>
            <EditorContentColumn>
                <Dropdown
                    id="function-selector"
                    sx={{ zIndex: 2, width: "100%", marginBottom: 20 }}
                    isRequired
                    items={options}
                    label="Available Functions"
                    onValueChange={handleOnSelect}
                    value={functionName}
                />
                <ActionButtons
                    primaryButton={{ text: "Save", onClick: handleConfigSave }}
                    secondaryButton={{ text: "Cancel", onClick: onBack }}
                    sx={{ justifyContent: "flex-end" }}
                />
            </EditorContentColumn>
        </SidePanelBody>
    );
}

export default FunctionConfigForm;

