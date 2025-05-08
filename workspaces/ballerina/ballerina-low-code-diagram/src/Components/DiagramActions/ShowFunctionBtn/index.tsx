/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useEffect, useState } from "react";

import { STModification } from "@wso2-enterprise/ballerina-core";
import {
    FunctionDefinition,
    IdentifierToken,
    STNode,
} from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";
import { Endpoint } from "../../../Types/type";
import {
    initializeViewState,
    recalculateSizingAndPositioning,
} from "../../../Utils";
import { StatementViewState } from "../../../ViewState";

import { HideFunctionSVG } from "./HideFunctionSVG";
import { ShowFunctionSVG } from "./ShowFunctionSVG";
import "./style.scss";

export interface ShowFunctionBtnProps {
    x: number;
    y: number;
    model: STNode;
    functionName: IdentifierToken;
    toolTipTitle?: string;
    isButtonDisabled?: boolean;
    createModifications?: (model: STNode) => STModification[];
    setConfirmDialogActive?: any;
    setFunctionBlock?: any;
    isConfirmDialogActive?: boolean;
}

export function ShowFunctionBtn(props: ShowFunctionBtnProps) {
    const {
        props: { isReadOnly, syntaxTree },
        api: {
            code: { getFunctionDef },
        },
        actions: { diagramRedraw },
    } = useContext(Context);

    const {
        model,
        createModifications,
        toolTipTitle,
        isButtonDisabled,
        functionName,
        setFunctionBlock,
        setConfirmDialogActive,
        isConfirmDialogActive,
        ...xyProps
    } = props;

    const [isBtnActive, setBtnActive] = useState(true);

    const nodeViewState: StatementViewState = model.viewState;

    useEffect(() => {
        setFunctionBlock(undefined);
        setConfirmDialogActive(false);
    }, [syntaxTree]);



    const fetchDefinition = async () => {
        const offsetValue = model.viewState.bBox.cy;
        const parentConnectors = model.viewState.parentBlock.viewState.connectors as Map<string, Endpoint>;
        if (isConfirmDialogActive) {
            nodeViewState.functionNodeExpanded = false;
            nodeViewState.functionNode = undefined;
            setConfirmDialogActive(false);
            diagramRedraw(recalculateSizingAndPositioning(initializeViewState(syntaxTree)));
        } else {
            try {
                const range: any = {
                    start: {
                        line: functionName.position?.startLine,
                        character: functionName.position?.startColumn,
                    },
                    end: {
                        line: functionName.position?.endLine,
                        character: functionName.position?.endColumn,
                    },
                };
                const funDef = await getFunctionDef(range, model.viewState.functionNodeFilePath);
                const expandST = funDef.syntaxTree as FunctionDefinition;
                const sizedBlock = initializeViewState(expandST, parentConnectors, offsetValue) as FunctionDefinition;
                sizedBlock.viewState.functionNodeFilePath = funDef.defFilePath;
                sizedBlock.viewState.functionNodeSource = sizedBlock.source;
                nodeViewState.functionNode = sizedBlock as FunctionDefinition;
                if (nodeViewState.functionNode.viewState.functionNodeSource !== model.viewState.functionNodeSource) {
                    nodeViewState.functionNodeExpanded = true;
                    setConfirmDialogActive(true);
                    diagramRedraw(syntaxTree);
                    setFunctionBlock(nodeViewState.functionNode);
                } else {
                    setBtnActive(false);
                }
            } catch (e) {
                // console.error(e);
            }
        }
    }

    const onBtnClick = async () => {
        fetchDefinition();
    };

    return (
        <g>
            {!isReadOnly && (
                <g>
                    <g
                        className={isBtnActive ? "expand-icon-show" : "expand-icon-show-disable"}
                        data-testid="func-expand-btn"
                        onClick={onBtnClick}
                    >
                        {!isConfirmDialogActive ? (
                            <ShowFunctionSVG {...xyProps} />
                        ) : (
                            <HideFunctionSVG {...xyProps} />
                        )}
                    </g>
                </g>
            )}
        </g>
    );
}
