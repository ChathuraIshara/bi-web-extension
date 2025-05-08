/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formSave: {
            width: '100%',
            height: 'auto',
            display: 'inline-flex',
            right: theme.spacing(2.5),
            backgroundColor: '#fff',
            zIndex: 100
        },
        buttonWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
            width: '50%'
        },
        stmtEditorToggle: {
            width: '50%'
        },
        spaceBetween: {
            padding: theme.spacing(1)
        }
    })
);
