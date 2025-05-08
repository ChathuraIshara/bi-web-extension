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

import { ConfigOverlayFormStatus, FlushStatementConfig, ProcessConfig, ReceivestatementConfig, SendStatementConfig, WaitStatementConfig, WizardType, WorkerConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { LocalVarDecl, NamedWorkerDeclaration } from "@wso2-enterprise/syntax-tree";

import { TextPreloaderVertical } from "../../../../../../PreLoader/TextPreloaderVertical";

import { AddAssignmentConfig } from "./AddAssignmentConfig";
import { AddCustomStatementConfig } from "./AddCustomStatementConfig";
import { AddFlushStatement } from "./AddFlushStatement";
import { AddFunctionCallConfig } from "./AddFunctionCallConfig";
import { AddLogConfig } from "./AddLogConfig";
import { AddReceiveStatement } from "./AddReceiveStatement";
import { AddSendStatement } from "./AddSendStatement";
import { AddVariableConfig } from "./AddVariableConfig";
import { AddWaitStatement } from "./AddWaitStatement";
import { AddWorkerConfigForm } from "./AddWorkerConfig";

interface ProcessFormProps {
    config: ProcessConfig;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
    configOverlayFormStatus: ConfigOverlayFormStatus;
}

export function ProcessForm(props: ProcessFormProps) {
    const { config, onCancel, onSave, onWizardClose, configOverlayFormStatus } = props;
    const { isLoading, error, formType: type, formArgs } = configOverlayFormStatus;

    let formType: string = type;
    if (formType === "Variable") {
        if (config.wizardType === WizardType.EXISTING) {
            const existingVariableModelValue: LocalVarDecl = config.model as LocalVarDecl;
            const existingVariableValue = existingVariableModelValue?.initializer?.source;
            config.config = existingVariableValue ? existingVariableValue : "";
        }
        else {
            config.config = "";
        }
    } else if (formType === "Log") {
        config.config = {
            type: "",
            expression: ""
        };
    } else if (formType === "Call" || formType === "Custom" || formType === "AssignmentStatement") {
        config.config = {
            expression: ""
        };
    } else if (formType === "Worker") {
        const workerConfig: WorkerConfig = {
            name: config.model ? (config.model as NamedWorkerDeclaration).workerName.value : '',
            returnType: config.model && (config.model as NamedWorkerDeclaration).returnTypeDesc ?
                (config.model as NamedWorkerDeclaration).returnTypeDesc.type.source : ''
        }

        config.config = workerConfig;
    } else if (formType === 'AsyncSend') {
        const sendConfig: SendStatementConfig = {
            targetWorker: '',
            expression: '',
        }

        config.config = sendConfig;
    } else if (formType === 'ReceiveStatement') {
        const receiveConfig: ReceivestatementConfig = {
            type: '',
            varName: '',
            senderWorker: '',
        };

        config.config = receiveConfig;
    } else if (formType === 'WaitStatement') {
        const waitConfig: WaitStatementConfig = {
            type: '',
            varName: '',
            expression: '',
        };

        config.config = waitConfig;
    } else if (formType === 'FlushStatement') {
        const flushStatementConfig: FlushStatementConfig = {
            varName: '',
            expression: ''
        };

        config.config = flushStatementConfig;
    } else {
        formType = "Custom";
        config.config = {
            expression: ""
        };
    }

    if (isLoading) {
        return (
            <TextPreloaderVertical position='relative' />
        );

    } else if (error) {
        return (
            <>
                {error?.message}
            </>
        );
    } else {
        return (
            <>
                {
                    formType === "Variable" && (
                        <AddVariableConfig
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "AsyncSend" && (
                        <AddSendStatement
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "ReceiveStatement" && (
                        <AddReceiveStatement
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "WaitStatement" && (
                        <AddWaitStatement
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "FlushStatement" && (
                        <AddFlushStatement
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "AssignmentStatement" && (
                        <AddAssignmentConfig
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "Log" && (
                        <AddLogConfig
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "Worker" && (
                        <AddWorkerConfigForm
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    (formType === "Custom") && (
                        <AddCustomStatementConfig
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    (formType === "Call") && (
                        <AddFunctionCallConfig
                            config={config}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
            </>
        );
    }
}
