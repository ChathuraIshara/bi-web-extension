/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        balModule: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            height: '140px',
            border: '1px solid #E6E7EC',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            padding: theme.spacing(2),
            cursor: 'pointer',
            '&:hover': {
                overflow: 'visible',
                transform: 'scale3d(1.04, 1.04, 1)',
                border: '1px solid #5567D5',
            },
        },
        balModuleName: {
            color: '#222228',
            fontSize: 13,
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 500,
            textAlign: 'center',
        },
        orgName: {
            color: '#CBCEDB',
            fontSize: 13,
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
        },
    })
);

export default useStyles;
