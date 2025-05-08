/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { css } from '@emotion/css';
import { ThemeColors } from '@wso2-enterprise/ui-toolkit';

export const useStyles = () => ({
    button: css({
        backgroundColor: ThemeColors.PRIMARY,
        borderRadius: '5px',
        color: 'white',
        fontSize: '12px',
        marginInline: '5px',
        minWidth: '140px',
        '&:hover': {
            backgroundColor: ThemeColors.PRIMARY_CONTAINER
        }
    }),
    container: css({
        alignItems: 'center',
        backgroundImage: 'radial-gradient(circle at 0.5px 0.5px, var(--vscode-textBlockQuote-border) 1px, transparent 0)',
        backgroundRepeat: 'repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw'
    }),
    messageBox: css({
        color: `${ThemeColors.ON_SURFACE}`,
        fontFamily: 'GilmerRegular',
        fontSize: '16px',
        padding: '10px'
    })
});
