/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js jsx-no-lambda jsx-wrap-multiline  no-implicit-dependencies no-submodule-imports
import React, { useEffect, useState } from "react";

import { LabelEditIcon } from "@wso2-enterprise/ballerina-core";
import { NodePosition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import { ContextMenu, Item } from "@wso2-enterprise/ui-toolkit";

import { useGraphQlContext } from "../../../DiagramContext/GraphqlDiagramContext";
import { getClassFunctionMenuItem, getFilterNodeMenuItem, getGoToSourceMenuItem } from "../../../MenuItems/menuItems";
import { verticalIconStyle, verticalIconWrapper } from "../../../MenuItems/style";
import { NodeCategory } from "../../../NodeFilter";
import { FunctionType, Position } from "../../../resources/model";
import { getParentSTNodeFromRange } from "../../../utils/common-util";
import { getSyntaxTree } from "../../../utils/ls-util";

interface ServiceHeaderMenuProps {
    location: Position;
    nodeName: string;
}

export function ClassHeaderMenu(props: ServiceHeaderMenuProps) {
    const { location, nodeName } = props;
    const { langClientPromise, currentFile, fullST, functionPanel, setFilteredNode, goToSource } = useGraphQlContext();

    const [showTooltip, setTooltipStatus] = useState<boolean>(false);
    const [classModel, setClassModel] = useState<STNode>(null);
    const [currentST, setCurrentST] = useState<STNode>(fullST);

    const handleEditClassDef = () => {
        if (classModel && STKindChecker.isClassDefinition(classModel)) {
            const lastMemberPosition: NodePosition = {
                endColumn: classModel.closeBrace.position.endColumn,
                endLine: classModel.closeBrace.position.endLine,
                startColumn: classModel.closeBrace.position.startColumn,
                startLine: classModel.closeBrace.position.startLine
            };
            functionPanel(lastMemberPosition, "GraphqlClass", classModel, location.filePath, currentST);
        }
    }

    useEffect(() => {
        if (showTooltip) {
            (async () => {
                const nodePosition: NodePosition = {
                    endColumn: location.endLine.offset,
                    endLine: location.endLine.line,
                    startColumn: location.startLine.offset,
                    startLine: location.startLine.line
                };
                if (location.filePath === currentFile.path) {
                    const parentNode = getParentSTNodeFromRange(nodePosition, fullST);
                    setClassModel(parentNode);
                } else {
                    // parent node is retrieved as the classObject.position only contains the position of the class name
                    const syntaxTree: STNode = await getSyntaxTree(location.filePath, langClientPromise);
                    const parentNode = getParentSTNodeFromRange(nodePosition, syntaxTree);
                    setClassModel(parentNode);
                    setCurrentST(syntaxTree)
                }
                setTooltipStatus(false);
            })();
        }
    }, [showTooltip]);


    const ItemWithIcon = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <LabelEditIcon />
                <div style={{ marginLeft: '5px' }}>
                    Rename Class
                </div>
            </div>
        )
    }

    const getMenuItems = () => {
        const menuItems: Item[] = [];
        if (classModel) {
            menuItems.push({ id: "edit-service", label: ItemWithIcon(), onClick: () => handleEditClassDef() });
            menuItems.push(getClassFunctionMenuItem(location, classModel, FunctionType.CLASS_RESOURCE, currentST, functionPanel));

        }
        menuItems.push(getGoToSourceMenuItem(location, goToSource));
        menuItems.push(getFilterNodeMenuItem({ name: nodeName, type: NodeCategory.SERVICE_CLASS }, setFilteredNode));
        return menuItems;
    }

    // TODO: Recheck the tooltip active status with the required props allowed
    return (
        <>
            {location?.filePath && location?.startLine && location?.endLine &&
                <div onClick={() => setTooltipStatus(true)}>
                    <ContextMenu iconSx={verticalIconStyle} sx={verticalIconWrapper} menuItems={getMenuItems()} />
                </div>
            }
        </>
    );
}
