/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { OpenAPI } from '../../../Definitions/ServiceDefinitions';
import { ReadOnlyInfo } from "../Info/ReadOnlyInfo";

export const PanelBody = styled.div`
    height: calc(100% - 87px);
    overflow-y: auto;
    padding: 16px;
    gap: 15px;
    display: flex;
    flex-direction: column;
`;

interface OverviewProps {
    openAPIDefinition: OpenAPI;
}

export function ReadOnlyOverview(props: OverviewProps) {
    const { openAPIDefinition } = props;

    return (
        <PanelBody>
            {openAPIDefinition && (<ReadOnlyInfo info={openAPIDefinition.info} />)}
        </PanelBody>
    )
}
