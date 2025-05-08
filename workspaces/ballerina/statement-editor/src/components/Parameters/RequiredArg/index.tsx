/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { ParameterInfo } from "@wso2-enterprise/ballerina-core";
import { Typography } from "@wso2-enterprise/ui-toolkit";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import { getParamHighlight } from "../../../utils";
import { useStmtEditorHelperPanelStyles } from "../../styles";

interface RequiredArgProps {
    param: ParameterInfo
    value: number
    handleCheckboxClick: (param: ParameterInfo) => () => void
}
export function RequiredArg(props: RequiredArgProps) {
    const { param, value, handleCheckboxClick } = props;
    const statementEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const isMandatory = !!param.modelPosition;

    const {
        modelCtx: {
            currentModel
        }
    } = useContext(StatementEditorContext);


    return (
        <div
            key={value}
            className={statementEditorHelperClasses.requiredArgList}
            style={getParamHighlight(currentModel.model, param)}
            data-testid="required-arg"
        >
            <VSCodeCheckbox
                checked={param.modelPosition !== undefined}
                {...(isMandatory && { disabled: true })}
                onClick={isMandatory ? undefined : handleCheckboxClick(param)}
                className={statementEditorHelperClasses.parameterCheckbox}
                data-testid="arg-check"
            />
            <Typography
                variant="body3"
                sx={{margin: '0px 5px'}}
            >
                {param.name}
            </Typography>
            <Typography
                className={statementEditorHelperClasses.suggestionDataType}
                variant="body3"
            >
                {param.type}
            </Typography>
            {param.description !== undefined && (
                <Typography
                    className={statementEditorHelperClasses.docParamDescriptionText}
                    variant="body3"
                >
                    {" : " + param.description}
                </Typography>
            )}
        </div>
    );
}
