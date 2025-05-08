/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { ClickAwayListener } from "@material-ui/core";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { PlusMenuEntry } from "../PlusOptionsSelector";
import { TopLevelPlusHolder } from "../TopLevelPlusHolder";

import { PlusOption } from "./PlusOption";
import "./style.scss";

interface PlusOptionRendererProps {
    entries: PlusMenuEntry[];
    onClose: () => void;
    goBack: () => void;
    onOptionSelect: (entry: PlusMenuEntry) => void;
    targetPosition: NodePosition;
    showCategorized?: boolean;
}

export function PlusOptionRenderer(props: PlusOptionRendererProps) {
    const { entries, onClose, goBack, onOptionSelect, showCategorized } = props;

    const simpleMenu = () => {
        const plusOptions: JSX.Element[] = entries.map(entry =>
            <PlusOption key={`plus-option-${entry.name.trim()}}`} entry={entry} onOptionSelect={onOptionSelect} />
        );

        return (
            <ul className="dropdown-menu">
                {plusOptions}
            </ul>
        );
    }

    const categorizedMenu = (
        <div className="dropdown-menu">
            <TopLevelPlusHolder entries={entries} onOptionSelect={onOptionSelect} />
        </div>
    );

    return (
        // <ClickAwayListener
        //     mouseEvent="onMouseDown"
        //     touchEvent="onTouchStart"
        //     onClickAway={onClose}
        // >
        <>
            <FormHeaderSection
                onCancel={onClose}
                onBack={goBack}
                formTitle={"lowcode.develop.configForms.plusholder.title"}
                defaultMessage={"Add Constructs"}
            />
            <div className={'dropdown'}>
                {showCategorized ? categorizedMenu : simpleMenu()}
            </div>
        </>
        // </ClickAwayListener>
    )
}
