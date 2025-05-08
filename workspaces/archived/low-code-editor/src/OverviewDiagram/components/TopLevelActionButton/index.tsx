/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import { FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { FormGenerator } from "../../../Diagram/components/FormComponents/FormGenerator";

import { useStyles } from './styles';

export interface TopLevelActionButtonProps {
    fileList: FileListEntry[];
}

export function TopLevelActionButton(props: TopLevelActionButtonProps) {
    const [showDrawer, setShowDrawer] = useState(false);
    const classes = useStyles();

    const handleActionBtnClick = () => {
        setShowDrawer(true);
    };

    const handleDrawerClose = () => {
        setShowDrawer(false);
    };

    return (
        <>
            <div
                className={classes.addComponentButton}
                onClick={handleActionBtnClick}
            >
                <AddIcon />
                <span>Component</span>
            </div>
            {showDrawer && (
                <FormGenerator
                    onCancel={handleDrawerClose}
                    configOverlayFormStatus={{
                        formType: "TopLevelOptionRenderer",
                        formArgs: {
                            kind: "ModulePart",
                            targetPosition: { startLine: 0, startColumn: 0 },
                            isTriggerType: false,
                            isLastMember: true,
                            showCategorized: true,
                            fileList: props.fileList
                        },
                        isLoading: false,
                    }}
                />
            )}
        </>
    );
}
