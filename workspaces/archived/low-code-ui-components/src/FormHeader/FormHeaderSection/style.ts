/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
        formHeaderTitleWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderBottom: '1px solid #d8d8d8',
            paddingLeft: '12px'
        },
        titleIcon: {
            display: 'flex',
            padding: theme.spacing(1),
            paddingLeft: theme.spacing(0),
        },
        formTitleWrapper: {
            width: "100%",
            zIndex: 100,
            height: theme.spacing(6),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '12px'
        },
        mainTitleWrapper: {
            display: 'inline-flex',
            alignItems: 'center',
            width: 'auto'
        },
        secondTitle: {
            position: 'absolute',
            left: 124,
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                marginTop: 4
            }
        }
    }),
    { index: 1 }
);
