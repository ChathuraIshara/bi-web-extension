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
        balModuleListWrap: {
            marginTop: theme.spacing(2),
            height: '80vh',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
        },
        balModuleSectionWrap: {
            marginTop: theme.spacing(6),
            '&:first-child': {
                marginTop: 0
            }
        },
        pageLoadingText: {
            marginLeft: theme.spacing(2),
        },
        container: {
            width: 600,
            height: '85vh',
            '& .MuiFormControl-marginNormal': {
                margin: '0 !important',
            },
            '& #module-list-container': {
                paddingRight: 0,
            },
        },
        msgContainer: {
            height: '80vh',
            alignContent: 'center',
            alignItems: 'center',
        },
        resultsContainer: {
            marginTop: theme.spacing(2),
            scrollbarWidth: 'none',
            display: 'flex',
            alignContent: 'flex-start',
        },
        filterBtn: {
            '& .MuiIconButton-root': {
                padding: 0
            },
            '& h5': {
                color: theme.palette.common.black,
                fontWeight: 400,
                marginLeft: theme.spacing(1),
            },
        },
        filterTagWrap: {
            maxHeight: '48px',
        },
        filterTag: {
            border: '1px solid #E6E7EC',
            borderRadius: '8px',
            paddingLeft: '8px'
        },
        filterRemoveBtn: {
            padding: '8px',
        }
    })
);

export default useStyles;
