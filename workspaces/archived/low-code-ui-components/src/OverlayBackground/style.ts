/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        overlayBackground: {
            background: '#e6e7ec6e',
            position: 'fixed',
            zIndex: 1,
            top: '-100rem',
            left: '-100rem'
        },

        confirmationOverlayBackground: {
            background: '#e6e7ec6e',
            position: 'fixed',
            zIndex: 2,
            top: 0,
            left: 0
        },
    }),
);
