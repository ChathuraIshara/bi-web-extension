/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() =>
    createStyles({
        autocompleteDropdown: {
            marginTop: "0",
            height: 35,
            width: "100%",
            borderRadius: 5,
            backgroundColor: "#ffffff",
            padding: '0.25rem 1rem',
            boxShadow: "inset 0 0 0 1px #dee0e7, inset 0 2px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 0 rgba(50, 50, 77, 0.07)",
            cursor: "pointer",
            "&:hover": {
                boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
            },
            "&:focus": {
                boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
            },
            "&:active": {
                boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
            },
            "&.Mui-focused": {
                boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
            },
        },
        outline: {
            outline: 'none',
        }
    })
);
