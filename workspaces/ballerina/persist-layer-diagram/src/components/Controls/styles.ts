/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { css } from '@emotion/css';

export const useStyles = () => ({
    button: css({
        alignItems: 'center !important',
        backgroundColor: 'white !important',
        borderRadius: '5px !important',
        border: '1px solid #808080 !important',
        color: '#595959 !important',
        display: 'flex !important',
        flexDirection: 'row !important',
        justifyContent: 'space-between !important',
        fontFamily: 'GilmerRegular !important',
        fontSize: '13px !important',
        height: '30px !important',
        textTransform: 'none !important',
        width: '100px !important'
    })
});
