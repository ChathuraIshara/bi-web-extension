/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-wrap-multiline
import React, { useContext } from "react";

import { ConditionConfig, ConfigOverlayFormStatus, ElseIfConfig, ForeachConfig, LowcodeEvent, SAVE_STATEMENT, STModification, WizardType } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";
import {
    createElseIfStatement, createElseStatement,
    createForeachStatement, createIfStatement, createWhileStatement, updateForEachCondition,
    updateIfStatementCondition, updateWhileStatementCondition
} from "../../../../utils/modification-util";
import { DiagramOverlayPosition } from "../../../Portals/Overlay";
import { InjectableItem } from "../../FormGenerator";

import { ConditionsOverlayForm } from "./ConditionsOverlayForm";

export interface ConditionConfigFormProps {
    type: string;
    targetPosition?: NodePosition;
    wizardType: WizardType;
    config?: ConditionConfig;
    scopeSymbols?: string[];
    onCancel: () => void;
    onSave: () => void;
    position?: DiagramOverlayPosition;
    configOverlayFormStatus: ConfigOverlayFormStatus;
}

export function ConditionConfigForm(props: ConditionConfigFormProps) {
    const { api } = useContext(Context);
    const {
        insights: { onEvent },
        code: { modifyDiagram }
    } = api;
    const { onCancel, onSave, configOverlayFormStatus } = props;
    let conditionConfig: ConditionConfig;
    const { isLoading, isOpen, error, formArgs, formType } = configOverlayFormStatus;

    switch (formType) {
        case "If":
            conditionConfig = {
                type: formType,
                conditionExpression: formArgs?.config && formArgs?.config.conditionExpression
                    ? formArgs?.config.conditionExpression
                    : {values: [{id: 0, expression: "", position: formArgs?.targetPosition}]},
                scopeSymbols: [],
                model: formArgs?.config && formArgs?.config.model
            };
            break;
        case "While":
            conditionConfig = {
                type: formType,
                conditionExpression: formArgs?.config && formArgs?.config.conditionExpression
                    ? formArgs?.config.conditionExpression : '',
                scopeSymbols: [],
                model: formArgs?.config && formArgs?.config.model
            };
            break;
        case "ForEach":
            conditionConfig = {
                type: formType,
                conditionExpression:
                    !formArgs?.config ?
                        { variable: '', collection: '', type: '' }
                        : formArgs?.config.conditionExpression,
                scopeSymbols: [],
                model: formArgs?.config && formArgs?.config.model
            };
            break;
        default:
            conditionConfig = {
                type: formType,
                conditionExpression: "",
                scopeSymbols: [],
            };
            break;
    }

    const onSaveClick = () => {
        if (formArgs?.targetPosition) {
            const modifications: STModification[] = [];

            if (formArgs?.expressionInjectables?.list){
                formArgs.expressionInjectables.list.forEach((item: InjectableItem) => {
                    modifications.push(item.modification)
                })
            }

            if (formType === "If") {
                const ifConfig: ElseIfConfig = conditionConfig.conditionExpression as ElseIfConfig;
                const compList = ifConfig?.values;
                if (!formArgs?.config) {
                    // const event: LowcodeEvent = {
                    //     type: SAVE_STATEMENT,
                    //     name: formType
                    // };
                    // onEvent(event);
                    modifications.push(createIfStatement(compList[0]?.expression, formArgs?.targetPosition));
                    if (compList.length > 1){
                        ifConfig?.values.slice(1).forEach((value) => {
                            modifications.push(createElseIfStatement(value.expression, formArgs?.targetPosition));
                        })
                    }
                    modifications.push(createElseStatement(formArgs?.targetPosition));
                } else {
                    ifConfig?.values.forEach((value) => {
                        modifications.push(updateIfStatementCondition(value.expression, value.position));
                    })
                }
            } else if (formType === "ForEach") {
                const conditionExpression: ForeachConfig = conditionConfig.conditionExpression as
                    ForeachConfig;
                if (!formArgs?.config) {
                    // const event: LowcodeEvent = {
                    //     type: SAVE_STATEMENT,
                    //     name: formType
                    // };
                    // onEvent(event);
                    modifications.push(createForeachStatement(conditionExpression.collection, conditionExpression.variable,
                        conditionExpression.type, formArgs?.targetPosition));
                } else {
                    modifications.push(updateForEachCondition(conditionExpression.collection, conditionExpression.variable,
                        conditionExpression.type, formArgs?.config.conditionPosition))
                }
                // modifications.push();
            } else if (formType === "While") {
                const whileConfig: ConditionConfig = conditionConfig as ConditionConfig;
                const conditionExpression: string = whileConfig.conditionExpression as string;
                if (!formArgs?.config) {
                    // const event: LowcodeEvent = {
                    //     type: SAVE_STATEMENT,
                    //     name: formType
                    // };
                    // onEvent(event);
                    modifications.push(createWhileStatement(conditionExpression, formArgs?.targetPosition));
                } else {
                    modifications.push(updateWhileStatementCondition(conditionExpression, formArgs?.config.conditionPosition));
                }
            }
            modifyDiagram(modifications);
            onSave();
        }
    };

    return (
        <ConditionsOverlayForm
            condition={conditionConfig}
            onCancel={onCancel}
            onSave={onSaveClick}
            onWizardClose={onSave}
            configOverlayFormStatus={configOverlayFormStatus}
        />
    )
}
