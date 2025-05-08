/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const ServiceUnsupportedStyles = makeStyles((theme: Theme) =>
    createStyles({
        overlayWrapper: {
            height: 'calc(100vh - 110px)',
            '&.overlay': {
                display: 'block',
                position: 'relative',
                backgroundColor: '#fff',
                opacity: '0.7',
                zIndex: -1
            },
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontWeight: 600,
            fontSize: "17px",
            lineHeight: "24px",
            marginTop: "28px",
            marginBottom: "4px",
            color: theme.palette.text.primary
        },
        subtitle: {
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "20px",
            color: theme.palette.text.hint
        },
        clickable: {
            cursor: 'pointer'
        },
    }),
);
