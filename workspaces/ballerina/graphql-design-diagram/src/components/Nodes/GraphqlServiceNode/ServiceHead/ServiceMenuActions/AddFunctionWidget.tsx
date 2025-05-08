/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda jsx-wrap-multiline
import React from "react";

import { GraphqlMutationIcon, GraphqlQueryIcon, GraphqlSubscriptionIcon } from "@wso2-enterprise/ballerina-core";
import { NodePosition, STKindChecker } from "@wso2-enterprise/syntax-tree";
import { Item, MenuItem } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../../../../DiagramContext/GraphqlDiagramContext";
import { FunctionType, Position } from "../../../../resources/model";

interface AddFunctionWidgetProps {
    position: Position;
    functionType: FunctionType;
}

export function AddFunctionWidget(props: AddFunctionWidgetProps) {
    const { position, functionType } = props;
    const { functionPanel, model } = useGraphQlContext();

    const openFunctionPanel = () => {
        if (STKindChecker.isServiceDeclaration(model)) {
            const lastMemberPosition: NodePosition = {
                endColumn: model.closeBraceToken.position.endColumn,
                endLine: model.closeBraceToken.position.endLine,
                startColumn: model.closeBraceToken.position.startColumn,
                startLine: model.closeBraceToken.position.startLine
            };
            if (functionType === FunctionType.QUERY) {
                functionPanel(lastMemberPosition, "GraphqlResource");
            } else if (functionType === FunctionType.MUTATION) {
                functionPanel(lastMemberPosition, "GraphqlMutation");
            } else if (functionType === FunctionType.SUBSCRIPTION) {
                functionPanel(lastMemberPosition, "GraphqlSubscription");
            }
        }
    };

    const popupTitle = () => {
        if (functionType === FunctionType.QUERY) {
            return "Add Query";
        } else if (functionType === FunctionType.MUTATION) {
            return "Add Mutation";
        } else {
            return "Add Subscription";
        }
    };

    const popupIcon = () => {
        if (functionType === FunctionType.QUERY) {
            return <GraphqlQueryIcon />;
        } else if (functionType === FunctionType.MUTATION) {
            return <GraphqlMutationIcon />;
        } else {
            return <GraphqlSubscriptionIcon />;
        }
    };

    const ItemWithIcon = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {popupIcon()}
                <div style={{ marginLeft: '5px' }}>
                    {popupTitle()}
                </div>
            </div>
        )
    }

    const menuItem: Item = { id: popupTitle(), label: ItemWithIcon(), onClick: () => openFunctionPanel() };

    return (
        <>
            {position &&
                <MenuItem
                    sx={{ pointerEvents: "auto", userSelect: "none" }}
                    item={menuItem}
                />
            }
        </>
    );
}
