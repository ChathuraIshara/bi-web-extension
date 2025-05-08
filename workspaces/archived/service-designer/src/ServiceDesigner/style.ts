/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { theme } from '@wso2-enterprise/ballerina-low-code-edtior-commons';

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            height: "100%",
            overflow: "hidden"
        },
        serviceList: {
            overflowY: "scroll",
            maxHeight: "90%"
        },
        expandAll: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginRight: "20px",
        },
        collapseBtn: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "row",
            width: "max-content",
            padding: "4px 4px 4px 8px",
            marginTop: "4px",
            borderRadius: "4px",
            color: "#8d91a3",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#e6e7ec",
            },
            "& #config-showed-options": {
                fill: "#8d91a3",
            },
        },
        signature: {
            padding: 8,
            fontWeight: 500,
            borderRadius: 5
        },
        responseTable: {
            width: "100%",
            "& thead td": {
                borderBottom: "1px solid rgba(59,65,81,.2)",
                color: "#3b4151",
                fontWeight: 700,
                padding: 12,
                textAlign: "left"
            },
            "& tr td": {
                color: "#3b4151",
                padding: 12,
                textAlign: "left"
            },
        },
        schema: {
            background: "#f3efef",
            padding: 16,
            width: "fit-content",
            marginRight: -250
        },
        schemaButton: {
            cursor: "pointer",
            fontWeight: 900,
            color: "#5567d5",
            textTransform: "none"
        },
        recordEdit: {
            textAlign: "end",
            marginTop: -15,
            cursor: "pointer"
        },
        serviceTitle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 40,
            width: "100%",
            boxShadow: "inset 0 -1px 0 0 #E6E7EC",
            backgroundColor: "#F7F8FB",
            alignItems: "center"
        },
        flexRow: {
            display: "flex",
            flexDirection: "row",
            gap: 8
        },
        serviceConfigure: {
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            padding: 7,
            "&:hover": {
                backgroundColor: "#e6e7ec",
            },
            "& #config-showed-options": {
                fill: "#8d91a3",
            },
        },
        listenerText: {
            color: theme.palette.text.hint,
            fontWeight: 400
        },
        gridContainer: {
            marginTop: "5%"
        },
        annotation: {
            display: "block",
            color: "rgba(0, 0, 0, 0.38)",
            fontWeight: 400
        },
        defaultResponse: {
            fontStyle: "italic",
            fontWeight: 200
        }
    }),
);
