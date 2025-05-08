/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React from "react";

import { Typography } from "@material-ui/core";
import { PrimaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { useStyles } from "./style";

export interface MultipleTabNotificationProps {
    isMultipleTabsOpen: boolean,
}

function handleOnclickRestore() {
    location.reload()
}

export function MultipleTabNotification(props: MultipleTabNotificationProps) {
    const { isMultipleTabsOpen } = props;
    const classes = useStyles();

    const component: JSX.Element = (
        <>
            <div className={classes.multipleTabsNotification}>
                <Typography variant="h1">
                    An instance of this application is already open in another tab
                </Typography>
                <p className={classes.subText}>
                    Please switch to the already open tab to continue
                </p>
                <div className={classes.buttonWrapper}>
                    <PrimaryButton text="Restore the Session" onClick={handleOnclickRestore} className={classes.multipleTabRestoreBtn}/>
                </div>
            </div>
            <div className={classes.backgroundOverlay}/>
        </>
    )

    return (
        isMultipleTabsOpen ? component : null
    );

}

export default MultipleTabNotification;
