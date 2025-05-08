/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
    wrapper: {
        padding: "0 24px"
    },
    header: {
        display: "flex",
        marginBottom: "10px",
    },
    title: {
        marginBottom: 12,
        fontSize: 13,
        letterSpacing: 0,
        fontWeight: 500,
        color: "#222228",
    },
    closeBtnWrapper: {
        background: 'none',
        color: '#cbcedb',
        border: 0,
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        cursor: 'pointer',
        outline: 'none',
    },
    closeBtn: {
        fontSize: 16,
        strokeWidth: 1,
        stroke: '#cbcedb',
        opacity: 1,
        fill: '#cbcedb',
    }
});
