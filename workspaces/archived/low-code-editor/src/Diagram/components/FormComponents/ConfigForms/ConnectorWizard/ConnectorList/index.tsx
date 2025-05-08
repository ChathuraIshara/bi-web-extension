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
import { useIntl } from "react-intl";

import { BallerinaConnectorInfo, BallerinaConnectorsRequest, BallerinaModuleResponse, DiagramEditorLangClientInterface } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { LocalVarDecl } from "@wso2-enterprise/syntax-tree";

import { UserState } from "../../../../../../types";
import { APIHeightStates } from "../../../DialogBoxes/PlusHolder";
import { FormGeneratorProps } from "../../../FormGenerator";
import { BallerinaModuleType, Marketplace, SearchQueryParams } from "../../Marketplace";

export interface ConnectorListProps {
    onSelect: (connector: BallerinaConnectorInfo, selectedConnector: LocalVarDecl) => void;
    onChange?: (type: string, subType: string, connector?: BallerinaConnectorInfo) => void;
    collapsed?: (value: APIHeightStates) => void;
    onCancel?: () => void;
}

export const fetchConnectorsList = async (
    queryParams: SearchQueryParams,
    currentFilePath: string,
    langClient: DiagramEditorLangClientInterface,
    userInfo?: UserState
): Promise<BallerinaModuleResponse> => {
    const { query, category, filterState, limit, page } = queryParams;
    const request: BallerinaConnectorsRequest = {
        targetFile: currentFilePath,
        query,
        limit,
    };
    if (category) {
        request.keyword = category;
    }
    if (userInfo && filterState && filterState.hasOwnProperty("My Organization")) {
        request.organization = userInfo.selectedOrgHandle;
    }
    if (page) {
        request.offset = (page - 1) * limit;
    }
    return langClient.getConnectors(request);
};

export function ConnectorList(props: FormGeneratorProps) {
    const intl = useIntl();
    const { onCancel } = props;
    const { onSelect } = props.configOverlayFormStatus.formArgs as ConnectorListProps;

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.connectorList.title",
        defaultMessage: "Connectors"
    });

    return (
        <Marketplace
            balModuleType={BallerinaModuleType.Connector}
            onSelect={onSelect}
            onCancel={onCancel}
            fetchModulesList={fetchConnectorsList}
            title={formTitle}
            shortName="connectors"
        />
    );
}

