/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from "@emotion/css";

export const useStyles = () => ({
    root: css({
        display: "flex",
    }),
    checkbox: css({
        color: "#2FA86C",
        "&$checked": {
            color: "#2FA86C",
            "&:hover": {
                background: "transparent",
            },
        },
    }),
    checkFormControl: css({
        margin: "8px",
        marginTop: 0,
    }),
    disabled: css({
        backgroundColor: "#afb9f6 !important",
        color: "#FFF !important",
    }),
    labelWrapper: css({
        display: 'flex',
        marginRight: 'auto'
    }),
    inputLabelForRequired: css({
        padding: 0,
        color: '#1D2028',
        fontSize: 13,
        textTransform: 'capitalize',
        display: 'inline-block',
        lineHeight: '35px',
        fontWeight: 300,
    }),
    starLabelForRequired: css({
        padding: 0,
        color: '#DC143C',
        fontSize: "13px",
        textTransform: 'capitalize',
        display: 'inline-block'
    })
});
