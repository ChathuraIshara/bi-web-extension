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
        footer: {
            height: 'auto',
            display: 'flex',
            width: '100%',
            padding: '15px 20px'
        },
        buttonWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
            width: '50%',
        },
        stmtEditorToggle: {
            width: '50%'
        },
        spaceBetween: {
            padding: `${theme.spacing(1)}px ${theme.spacing(0.1)}px`,
            '&:last-child': {
                paddingRight: 0
            }
        }
    })
);
