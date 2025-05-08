/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { css } from "@emotion/css";

export const useStyles = () => ({
    balModuleListWrap: css({
        marginTop: '16px',
        height: '80vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
    }),
    balModuleSectionWrap: css({
        marginTop: '48px',
        '&:first-of-type': {
            marginTop: 0,
        },
    }),
    pageLoadingText: css({
        marginLeft: '30px',
    }),
    container: css({
        width: '600px',
        height: '85vh',
        '& .MuiFormControl-marginNormal': {
            margin: '0 !important',
        },
        '& #module-list-container': {
            paddingRight: 0,
        },
    }),
    msgContainer: css({
        height: '80vh',
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
    }),
    resultsContainer: css({
        marginTop: '16px',
        scrollbarWidth: 'none',
        display: 'flex',
        alignContent: 'flex-start',
    })
});

export default useStyles;

