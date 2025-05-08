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

import { ConditionConfig, ConfigOverlayFormStatus, ElseIfConfig } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { TextPreloaderVertical } from "../../../../../../PreLoader/TextPreloaderVertical";

import { AddForeachForm } from "./AddForeachForm";
import { AddIfForm } from "./AddIfForm/index";
import { AddWhileForm } from "./AddWhileForm";

interface ConditionsWizardProps {
    condition: ConditionConfig;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
    configOverlayFormStatus: ConfigOverlayFormStatus
}


export function ConditionsOverlayForm(props: ConditionsWizardProps) {
    const { condition, onCancel, onSave, onWizardClose, configOverlayFormStatus } = props;
    const { isLoading, error, formType, formArgs} = configOverlayFormStatus;

    if (formType === "While") {
        if (!condition.conditionExpression) {
            condition.conditionExpression = "";
        }
    } else if (formType === "If") {
        if (!condition.conditionExpression) {
            condition.conditionExpression = condition?.conditionExpression as ElseIfConfig
        }
    } else if (formType === "ForEach") {
        if (!condition.conditionExpression) {
            condition.conditionExpression = {
                variable: '', collection: '', type: ''
            };
        }
    }

    if (isLoading) {
        return (
            <div>
                <TextPreloaderVertical position='relative' />
            </div>
        );

    } else if (error) {
        return (
            <div>
                {error?.message}

            </div>
        );
    } else {
        return (
            <div>
                {
                    formType === "If" && (
                        <AddIfForm
                            condition={condition}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "ForEach" && (
                        <AddForeachForm
                            condition={condition}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
                {
                    formType === "While" && (
                        <AddWhileForm
                            condition={condition}
                            formArgs={formArgs}
                            onSave={onSave}
                            onWizardClose={onWizardClose}
                            onCancel={onCancel}
                        />
                    )
                }
            </div>
        );
    }
}
