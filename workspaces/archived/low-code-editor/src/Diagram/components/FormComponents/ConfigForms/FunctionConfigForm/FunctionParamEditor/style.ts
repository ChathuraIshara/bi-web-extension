/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerWrapper: {
            display: 'flex',
        },
        headerLabel: {
            background: 'white',
            padding: 10,
            borderRadius: 5,
            border: '1px solid #dee0e7',
            margin: '1rem 0 0.25rem',
            justifyContent: 'space-between',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
        },
        headerLabelCursor: {
            cursor: "pointer",
            width: "100%"
        },
        paramEditorWrap: {
            boxSizing: "border-box",
            height: "153px",
            width: "100%",
            border: "1px solid #EEEEEE",
            backgroundColor: "#F7F8FB",
        },
        functionParamEditorWrap: {
            boxSizing: "border-box",
            width: "100%",
            border: "1px solid #EEEEEE",
            backgroundColor: "#F7F8FB",
            padding: theme.spacing(2),
            borderRadius: 4
        },
        labelOfInputs: {
            height: "24px",
            width: "38px",
            color: "#1D2028",
            fontSize: "13px",
            letterSpacing: "0",
            lineHeight: "24px"
        },
        actionBtn: {
            fontSize: 13,
        },
        btnContainer: {
            display: "flex",
            justifyContent: "flex-end",
            marginTop: theme.spacing(1)
        },
        iconBtn: {
            padding: 0
        }
    })
);
