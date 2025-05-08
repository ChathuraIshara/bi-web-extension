/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        warningContainer: {
            marginTop: 20,
            marginLeft: 16,
            marginRight: 16,
            backgroundColor: '#FFF5EB',
            borderStyle: 'solid',
            borderRadius: 8,
            padding: theme.spacing(1),
            minWidth: 120,
            width: 'fit-content',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            borderColor: '#FFCC8C'
        },
        warningIcon: {
            width: 16,
            marginRight: 8,
            marginTop: 5
        },
    })
);
