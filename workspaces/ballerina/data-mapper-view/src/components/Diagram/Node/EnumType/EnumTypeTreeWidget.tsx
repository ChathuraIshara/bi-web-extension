/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import * as React from "react";

import styled from "@emotion/styled";
import { DiagramEngine } from "@projectstorm/react-diagrams";

import { IDataMapperContext } from "../../../../utils/DataMapperContext/DataMapperContext";
import { RecordFieldPortModel } from "../../Port";
import { ENUM_TYPE_SOURCE_PORT_PREFIX } from "../../utils/constants";
import { TreeBody, TreeContainer } from "../commons/Tree/Tree";

import { EnumTypeItemWidget } from "./EnumTypeItemWidget";
import { DMEnumTypeDecl } from "./EnumTypeNode";

export interface EnumTypeTreeWidgetProps {
    enums: DMEnumTypeDecl[];
    engine: DiagramEngine;
    context: IDataMapperContext;
    getPort: (portId: string) => RecordFieldPortModel;
    handleCollapse: (portName: string, isExpanded?: boolean) => void;
}

export function EnumTypeTreeWidget(props: EnumTypeTreeWidgetProps) {
    const { engine, enums, getPort, handleCollapse } = props;
    const hasMappingsWithModuleVariables = enums.length > 0;

    return (
        <>
            {hasMappingsWithModuleVariables && (
                <TreeContainer data-testid={"enum-type-node"}>
                    <ModuleVarsHeader>
                        <HeaderText>Enums</HeaderText>
                    </ModuleVarsHeader>
                    <TreeBody>
                        {enums.map((e) => {
                            return (
                                <EnumTypeItemWidget
                                    key={`${ENUM_TYPE_SOURCE_PORT_PREFIX}.${e.varName}`}
                                    id={`${ENUM_TYPE_SOURCE_PORT_PREFIX}.${e.varName}`}
                                    engine={engine}
                                    enumType={e}
                                    getPort={(portId: string) =>
                                        getPort(portId) as RecordFieldPortModel
                                    }
                                    handleCollapse={handleCollapse}
                                    valueLabel={e.varName}
                                />
                            );
                        })}
                    </TreeBody>
                </TreeContainer>
            )}
        </>
    );
}

const ModuleVarsHeader = styled.div`
    background: var(--vscode-editorWidget-background);
    width: 100%;
    line-height: 35px;
    display: flex;
    justify-content: space-between;
    cursor: default;
`;

const HeaderText = styled.span`
    margin-left: 10px;
    min-width: 280px;
    font-size: 13px;
    font-weight: 600;
`;
