/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
import { useIntl } from "react-intl";

import { FormControl } from "@material-ui/core";
import { ProcessConfig, WorkerConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NamedWorkerDeclaration, NodePosition } from "@wso2-enterprise/syntax-tree";
import { v4 as uuid } from 'uuid';

import { useDiagramContext } from "../../../../../../../Contexts/Diagram";
import { useStyles as useFormStyles } from "../../../../DynamicConnectorForm/style";
import { SwitchToggle } from "../../../../FormFieldComponents/SwitchToggle";
import { VariableNameInput } from "../../../Components/VariableNameInput";

interface WorkerConfigFormProps {
    config: ProcessConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export function AddWorkerConfigForm(props: WorkerConfigFormProps) {
    const { onCancel, formArgs, onSave, onWizardClose, config } = props;
    const intl = useIntl();
    const {
        props: {
            experimentalEnabled,
            isMutationProgress,
        }
    } = useDiagramContext();
    const formClasses = useFormStyles();
    const saveLogButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.log.saveButton.label",
        defaultMessage: "Save"
    });
    const workerConfig = config.config as WorkerConfig;
    const [isExpressionsValid, setExpressionValidity] = useState(false);
    const [uniqueId] = useState(uuid());
    const [allowReturnType, setAllowReturnType] = useState<boolean>(workerConfig.returnType.trim().length > 0);

    const model = config.model as NamedWorkerDeclaration;

    const onWorkerNameChange = (name: string) => {
        workerConfig.name = name;
    }

    const onReturnTypeChange = (type: string) => {
        workerConfig.returnType = type;
    }

    const handleSwitchToggleChange = (checked: boolean) => {
        workerConfig.returnType = '';
        setAllowReturnType(!allowReturnType);
    }

    let namePosition: NodePosition = {
        startLine: 0,
        startColumn: 0,
        endLine: 0,
        endColumn: 0
    };

    let returnPosition: NodePosition = {
        startLine: 0,
        startColumn: 0,
        endLine: 0,
        endColumn: 0
    };
    let returnTypeTemplate;

    if (model) {
        namePosition = model.workerName.position;
        returnPosition = model.returnTypeDesc ? model.returnTypeDesc.type.position : {
            ...model.workerName.position,
            startColumn: model.workerName.position.endColumn,
            endColumn: model.workerName.position.endColumn,
        };

        returnTypeTemplate = model.returnTypeDesc ? {
            defaultCodeSnippet: '',
            targetColumn: 0
        } : {
            defaultCodeSnippet: ' returns ',
            targetColumn: 9
        }
    } else {
        returnPosition.startLine = namePosition.startLine = formArgs.targetPosition.startLine;
        returnPosition.endLine = namePosition.endLine = formArgs.targetPosition.startLine;
        returnTypeTemplate = {
            defaultCodeSnippet: `worker workerName${uniqueId.replaceAll('-', '_')} returns  {}`,
            targetColumn: 63
        }
    }

    const updateExpressionValidity = (fieldName: string, isInValid: boolean) => {
        setExpressionValidity(!isInValid);
    }

    const nameTemplate = {
        defaultCodeSnippet: 'worker {}',
        targetColumn: 8
    };

    const returnTypeInput = (
        <VariableNameInput
            displayName="Return type"
            value={workerConfig.returnType}
            onValueChange={onReturnTypeChange}
            validateExpression={updateExpressionValidity}
            position={returnPosition}
            isEdit={!!model}
            initialDiagnostics={model?.returnTypeDesc?.type.typeData?.diagnostics}
            overrideTemplate={returnTypeTemplate}
            hideSuggestions={false}
        />
    )

    return (
        <FormControl data-testid="worker-form" className={formClasses.wizardFormControl}>
            <FormHeaderSection
                onCancel={onCancel}
                formTitle={"lowcode.develop.configForms.worker.title"}
                defaultMessage={"Worker"}
            />
            <div className={formClasses.formContentWrapper}>
                <VariableNameInput
                    displayName={'Worker Name'}
                    value={workerConfig.name}
                    onValueChange={onWorkerNameChange}
                    validateExpression={updateExpressionValidity}
                    position={namePosition}
                    isEdit={!!model}
                    initialDiagnostics={model?.workerName?.typeData?.diagnostics}
                    overrideTemplate={model ? undefined : nameTemplate}
                />
                <SwitchToggle
                    text="Add return type"
                    onChange={handleSwitchToggleChange}
                    initSwitch={workerConfig.returnType.trim().length > 0}
                />
                {allowReturnType && returnTypeInput}
            </div>
            <FormActionButtons
                cancelBtnText="Cancel"
                cancelBtn={true}
                saveBtnText={saveLogButtonLabel}
                isMutationInProgress={isMutationProgress}
                validForm={isExpressionsValid}
                onSave={onSave}
                onCancel={onCancel}
            />
        </FormControl>
    )
}
