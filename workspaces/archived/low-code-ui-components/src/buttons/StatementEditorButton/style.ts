/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: ordered-imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        expressionButtonWrapper: {
            textTransform: "capitalize",
            border: 0,
            background: '#f4f8ff',
            padding: '5px 10px',
            fontFamily: "arial, sans-seriff",
            color: theme.palette.primary.main,
            fontSize: 13,
            textDecoration: "none",
            cursor: "pointer",
            borderWidth: 1,
            borderColor: theme.palette.primary.main,
            borderStyle: 'solid',
            height: theme.spacing(3.75),
            marginTop: theme.spacing(0.875),
            borderRadius: 5,
            display: 'flex',
            width: theme.spacing(17.5),
            marginLeft: theme.spacing(1.25),
            "&:hover , &:focus, &:active": {
                background: '#f4f8ff',
                boxShadow: "none",
                cursor: "pointer",
            },
            '&:disabled': {
                opacity: 0.5,
                background: '#fff',
                color: theme.palette.primary.light,
            },
        },
        expressionTitle: {
            textTransform: 'capitalize',
            fontSize: 12,
            fontWeight: 300,
            color: theme.palette.primary.main,
            margin: '1px 0 0 4px',
        }
    }),
);
