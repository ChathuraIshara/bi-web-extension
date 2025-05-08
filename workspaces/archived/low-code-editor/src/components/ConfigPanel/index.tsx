/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// tslint:disable: jsx-no-multiline-js
import React from "react";

import { CloseIcon } from "../../assets/icons";

import { useStyles } from "./styles";

export { default as Section } from "./Section";

export default function ConfigPanel(props: any) {
    const classes = useStyles();
    const { title, children, onClose, showClose } = props;

    return (
        <div className={classes.wrapper}>
            <div className={classes.header}>
                <p className={classes.title}>{title}</p>
                {(showClose) && (
                    <button className={classes.closeBtnWrapper} onClick={onClose}>
                        <CloseIcon className={classes.closeBtn} />
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}
