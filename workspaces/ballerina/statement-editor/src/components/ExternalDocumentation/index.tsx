/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useContext } from "react";

import { BallerinaConnectorInfo } from "@wso2-enterprise/ballerina-core";
import { Tooltip } from "@wso2-enterprise/ui-toolkit";

import ToolbarDocumentationIcon from "../../assets/icons/ToolbarDocumentationIcon";
import { StatementEditorContext } from "../../store/statement-editor-context";
import { useStatementEditorStyles } from "../styles";

export interface DocButtonProps {
    connectorInfo?: BallerinaConnectorInfo;
}

export function DocumentationButton(props: DocButtonProps) {
    const { connectorInfo } = props;
    const statementEditorClasses = useStatementEditorStyles();
    const {
        openExternalUrl
    } = useContext(StatementEditorContext);

    const openStatementEditorHelp = () => {
        if (connectorInfo) {
            openExternalUrl("https://lib.ballerina.io/" + connectorInfo.package.organization + "/" +
                connectorInfo.moduleName + "/" + connectorInfo.package.version + "/#" + connectorInfo.name);
        }
    }

    return (
        <div className={statementEditorClasses.docButton}>
            <ToolbarDocumentationIcon/>
            <Tooltip content={"Refer Ballerina Docs"} position="bottom">
                <div
                    onClick={openStatementEditorHelp}
                    className={statementEditorClasses.helpLink}
                >
                    Docs
                </div>
            </Tooltip>
        </div>
    );
}
