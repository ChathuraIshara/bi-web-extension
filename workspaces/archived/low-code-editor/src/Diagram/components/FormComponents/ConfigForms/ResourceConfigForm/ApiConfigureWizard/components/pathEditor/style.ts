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
        headerLabelWithCursor: {
            background: 'white',
            padding: 10,
            borderRadius: 5,
            cursor: "pointer",
            border: '1px solid #dee0e7',
            margin: '1rem 0 0.25rem',
            justifyContent: 'space-between',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
        },
        addPathBtn: {
            outline: "none",
            color: "#5567D5",
            fontSize: 13,
            letterSpacing: 0,
            lineHeight: "16px",
            cursor: "pointer",
            background: "#fff",
            border: "0px solid #5567d55c",
            padding: "4px 8px",
            borderRadius: 8,
            marginTop: theme.spacing(1.5),
            fontFamily: 'inherit',
            marginBottom: theme.spacing(1.5),
        },
        addPathBtnWrap: {
            display: "flex",
            alignItems: "center",
            "& .MuiSvgIcon-root": {
                height: '18px !important',
            }
        },
        segmentEditorWrap: {
            boxSizing: "border-box",
            width: "100%",
            border: "1px solid #EEEEEE",
            backgroundColor: "#F7F8FB",
            padding: theme.spacing(3.125),
            borderRadius: 4,
            marginTop: theme.spacing(2),
        },
        segmentNameContainer: {
            width: '100%',
            marginBottom: theme.spacing(2),
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
            justifyContent: "flex-end"
        },
        iconBtn: {
            padding: 0
        },
        segmentTypeEditor: {
            position: "relative"
        }
    })
);
