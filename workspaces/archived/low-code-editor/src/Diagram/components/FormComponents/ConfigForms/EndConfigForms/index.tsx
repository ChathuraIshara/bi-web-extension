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
// tslint:disable: ordered-imports
import React, { useContext } from "react";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../Contexts/Diagram";

import {
    ConfigOverlayFormStatus,
    STModification,
    SAVE_STATEMENT,
    LowcodeEvent,
    EndConfig,
    RespondConfig,
    genVariableName,
    getAllVariables
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    createPropertyStatement,
    createReturnStatement,
    updatePropertyStatement,
    updateReturnStatement
} from "../../../../utils/modification-util";

import { EndOverlayForm } from "./EndOverlayForm";

export interface AddEndFormProps {
    type: string;
    targetPosition: NodePosition;
    scopeSymbols?: string[];
    onCancel: () => void;
    onSave: () => void;
    model?: STNode;
    configOverlayFormStatus: ConfigOverlayFormStatus;
}

export function EndConfigForm(props: any) {
    const {
        api: {
            insights: { onEvent },
            code: {
                modifyDiagram,
            }
        },
        props: { stSymbolInfo }
    } = useContext(Context);

    const { onCancel, onSave, configOverlayFormStatus } = props as AddEndFormProps;
    const { formArgs, formType } = configOverlayFormStatus;

    const endConfig: EndConfig = {
        type: formType,
        expression: '',
        scopeSymbols: [],
        model: formArgs?.model
    };

    const onCancelClick = () => {
        onCancel();
    };

    const onSaveClick = () => {
        if (formArgs?.targetPosition) {
            const modifications: STModification[] = [];
            if (endConfig.model) {
                switch (endConfig.type) {
                    case 'Return':
                        const updateReturnStmt: STModification = updateReturnStatement(
                            endConfig.expression as string, formArgs?.targetPosition);
                        modifications.push(updateReturnStmt);
                        break;
                    case 'Respond':
                        const respondConfig: RespondConfig = endConfig.expression as RespondConfig;
                        let respondExpression = "check $caller->respond($expression);";
                        respondExpression = respondExpression
                            .replace("$caller", respondConfig.caller)
                            .replace("$expression", respondConfig.respondExpression);
                        const updateRespond: STModification = updatePropertyStatement(
                            respondExpression, formArgs?.targetPosition
                        );
                        modifications.push(updateRespond);
                        break;
                }
            } else {
                if (endConfig.type === "Return") {
                    // const event: LowcodeEvent = {
                    //     type: SAVE_STATEMENT,
                    //     name: endConfig.type
                    // };
                    // onEvent(event);
                    const addReturnStatement: STModification = createReturnStatement(
                        endConfig.expression as string, formArgs?.targetPosition);
                    modifications.push(addReturnStatement);
                } else if (endConfig.type === "Respond") {
                    const respondConfig: RespondConfig = endConfig.expression as RespondConfig;
                    const responseCodeConfig = (endConfig?.expression as RespondConfig)?.responseCode;
                    if (responseCodeConfig) {
                        const responseName = genVariableName("resp", getAllVariables(stSymbolInfo));
                        const responseDeclaration = "http:Response " + responseName + " = new;";
                        const responseDeclarationModification: STModification = createPropertyStatement(
                            responseDeclaration, formArgs?.targetPosition
                        );
                        modifications.push(responseDeclarationModification);

                        const responseGenStatement = responseName + ".statusCode = " + responseCodeConfig + ";";
                        const responseGenStatementModification: STModification = createPropertyStatement(
                            responseGenStatement, formArgs?.targetPosition
                        );
                        modifications.push(responseGenStatementModification);

                        if (respondConfig.respondExpression !== "") {
                            let responsePayoadStatement = responseName + ".setPayload($expression);";
                            responsePayoadStatement = responsePayoadStatement
                                .replace("$expression", respondConfig.respondExpression);
                            const responsePayoadStatementModification: STModification = createPropertyStatement(
                                responsePayoadStatement, formArgs?.targetPosition
                            );
                            modifications.push(responsePayoadStatementModification);
                        }

                        let respondStatusCodeExpression = "check $caller->respond($expression);";
                        respondStatusCodeExpression = respondStatusCodeExpression
                            .replace("$caller", respondConfig.caller)
                            .replace("$expression", responseName);
                        const addRespondWithCode: STModification = createPropertyStatement(
                            respondStatusCodeExpression, formArgs?.targetPosition
                        );
                        modifications.push(addRespondWithCode);

                    } else {
                        // const event: LowcodeEvent = {
                        //     type: SAVE_STATEMENT,
                        //     name: endConfig.type
                        // };
                        // onEvent(event);
                        let respondExpression = "check $caller->respond($expression);";
                        respondExpression = respondExpression
                            .replace("$caller", respondConfig.caller)
                            .replace("$expression", respondConfig.respondExpression);
                        const addRespond: STModification = createPropertyStatement(
                            respondExpression, formArgs?.targetPosition
                        );
                        modifications.push(addRespond);
                    }
                }
            }
            modifyDiagram(modifications);
            onSave();
        }
    };

    return (
        <EndOverlayForm
            configOverlayFormStatus={configOverlayFormStatus}
            config={endConfig}
            onCancel={onCancelClick}
            onSave={onSaveClick}
            onWizardClose={onSave}
        />
    );
}
