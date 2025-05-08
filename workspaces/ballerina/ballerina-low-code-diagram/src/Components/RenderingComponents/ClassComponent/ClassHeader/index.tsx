/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext } from 'react';

import { ClassIcon, DeleteButton, EditButton } from '@wso2-enterprise/ballerina-core';
import { ClassDefinition } from '@wso2-enterprise/syntax-tree';
import classNames from 'classnames';

import { Context } from '../../../../Context/diagram';
import { HeaderWrapper } from '../../../../HeaderWrapper';

interface ClassHeaderProps {
    model: ClassDefinition;
    onExpandClick: () => void;
    isExpanded: boolean;
}

export function ClassHeader(props: ClassHeaderProps) {
    const { model, onExpandClick } = props;
    const diagramContext = useContext(Context);
    const { isReadOnly } = diagramContext.props;
    const deleteComponent = diagramContext?.api?.edit?.deleteComponent;
    const gotoSource = diagramContext?.api?.code?.gotoSource;
    const renderDialogBox = diagramContext?.api?.edit?.renderDialogBox;

    const handleDeleteBtnClick = () => {
        deleteComponent(model);
    }

    const handleEditBtnClick = () => {
        renderDialogBox("Unsupported", handleEditBtnConfirm);
    }

    const handleEditBtnConfirm = () => {
        const targetposition = model.position;
        gotoSource({ startLine: targetposition.startLine, startColumn: targetposition.startColumn });
    }

    const editButtons = (
        <div className="class-amendment-options">
            <div className={classNames("class-component-edit", "show-on-hover")}>
                <EditButton onClick={handleEditBtnClick} />
            </div>
            <div className={classNames("class-component-delete", "show-on-hover")}>
                <DeleteButton onClick={handleDeleteBtnClick} />
            </div>
        </div>
    );

    return (
        <HeaderWrapper
            className={'class-component-header'}
            onClick={onExpandClick}
        >
            <div className={'header-segement-container'}>
                <div className="header-segment" >
                    <ClassIcon />
                </div>
                <div className={"header-segment"}>Class</div>
                <div className={"header-segment-path"}>{model.className.value}</div>
            </div>
            {!isReadOnly && editButtons}
        </HeaderWrapper>
    );
}
