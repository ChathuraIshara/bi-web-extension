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
    radioBtnWrapper: {
        "& .MuiFormGroup-root": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
        },
        "& .MuiFormControlLabel-root": {
            width: "48%",
        },
    },
    radioBtn: {
        border: "1px solid #8d91a3",
        borderRadius: "4px",
        backgroundColor: "#fff",
        letterSpacing: 0,
        lineHeight: "16px",
        fontSize: "11px",
        color: "#8d91a3",
        padding: "6px 12px 5px",
        margin: "0 6px 0 0",
        outline: "none",
        cursor: "pointer",
    },
    radioSelected: {
        color: "#fff",
        border: 0,
    }
});
