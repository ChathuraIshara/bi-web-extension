/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
        listenerText: {
            color: theme.palette.text.hint,
            fontWeight: 400
        },
        iconBtn: {
            width: 20
        },
        resourceAdd: {
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            borderRadius: 3,
            padding: "4px 9px 4px 6px",
            backgroundColor: theme.palette.primary.main,
            color: "white",
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
    }),
);
