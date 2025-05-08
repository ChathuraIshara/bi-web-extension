/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        searchBarRoot: {
            height: '40px',
            width: '95%',
            marginTop: '10px',
            padding: theme.spacing(0.5),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #E6E7EC',
            borderRadius: '28px',
            backgroundColor: theme.palette.common.white,
        },

        searchIcon: {
            height: theme.spacing(2.375),
            width: theme.spacing(2.25),
            marginTop: theme.spacing(1.5),
            marginLeft: theme.spacing(1.375),
            marginBottom: theme.spacing(1.125),
            marginRight: theme.spacing(0.75),
        },
        searchText: {
            width: '100%',
            marginLeft: theme.spacing(2),
            ...theme.typography.subtitle2,
        },
    })
);

export default useStyles;
