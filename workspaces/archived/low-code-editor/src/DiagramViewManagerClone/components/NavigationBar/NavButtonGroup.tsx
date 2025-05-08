/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";

import { ArrowBack, HomeOutlined } from "@material-ui/icons";

import { useHistoryContext } from "../../context/history";
import { extractFilePath } from "../../utils";

interface NavButtonGroupProps {
    currentProjectPath: string;
}

export function NavButtonGroup(props: NavButtonGroupProps) {
    const { currentProjectPath } = props;
    const { history, historyPop, historyClearAndPopulateWith } = useHistoryContext();

    const handleBackButtonClick = () => {
        if (history.length > 1) {
            historyPop();
        }
    }

    const handleHomeButtonClick = () => {
        if (history.length > 0) {
            historyClearAndPopulateWith({
                file: extractFilePath(currentProjectPath)
            });
        }
    }

    return (
        <>
            <div
                className="btn-container"
                aria-disabled={!(history.length > 1)}
                onClick={handleBackButtonClick}
            >
                <ArrowBack className={!(history.length > 1) ? 'is-disabled' : ''} />
            </div>
            <div
                className="btn-container"
                aria-disabled={!(history.length > 0)}
                onClick={handleHomeButtonClick}
            >
                <HomeOutlined />
            </div>
        </>
    );
}
