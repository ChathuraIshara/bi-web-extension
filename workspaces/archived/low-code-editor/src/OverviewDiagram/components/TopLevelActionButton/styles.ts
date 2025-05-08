/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: ordered-imports
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            position: "absolute",
            bottom: 15,
            left: 15,
            backgroundColor: theme.palette.primary.main,
            borderRadius: "2px",
            color: "white",
            fontSize: "12px",
            marginInline: "2.5px",
            "&:hover": {
                backgroundColor: "#4958ba",
            },
        },
        addComponentButton: {
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            padding: '4px 9px 4px 6px',
            backgroundColor: theme.palette.primary.main,
            color: "white",
            marginLeft: 'auto',
            height: 32,
        }
    })
);
