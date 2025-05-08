/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { css } from "@emotion/css";
import { Icon, Typography } from "@wso2-enterprise/ui-toolkit";

const useStyles = () => ({
    menuItem: css({
        fontSize: '12px',
        height: '30px',
        cursor: "pointer",
        '&:hover': {
            backgroundColor: 'var(--vscode-list-hoverBackground)',
        }
    }),
    menuItemText: css({
        padding: '5px',
        fontSize: '12px'
    })
});

export interface RecordItemProps {
    recordName: string;
    onClickRecordItem: (recordName: string) => void;
}

export function RecordItem(props: RecordItemProps) {
    const { recordName, onClickRecordItem } = props;
    const classes = useStyles();

    const onClickOnListItem = () => {
        onClickRecordItem(recordName);
    };

    return (
        <>
            <div
                className={classes.menuItem}
                key={recordName}
                onClick={onClickOnListItem}
            >
                <Icon name="symbol-struct-icon" />
                <Typography className={classes.menuItemText}>{recordName}</Typography>
            </div>
        </>
    );
}

