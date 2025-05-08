/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
        container: {
            width: '100%',
        },
        subTitle: {
            marginTop: theme.spacing(6),
            color: theme.palette.text.secondary
        },
        hint: {
            marginTop: theme.spacing(6),
            textAlign: 'center',
            color: theme.palette.text.secondary
        },
        fullHeight: {
            height: '80vh',
        },
        endpointItem: {
            '&:hover': {
                color: theme.palette.primary.main
            },
        },
        actionList: {
            height: '83vh',
            overflowY: 'scroll',
        },
        actionItem: {
            '&:hover p': {
                display: 'block',
                whiteSpace: 'normal',
            },
            '&:hover': {
                color: theme.palette.primary.main,
            },
        },
        actionTitle: {
            width: 220,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        actionSubtitle: {
            display: 'none',
            color: theme.palette.text.hint,
        },
        searchBox: {
            position: 'relative',
            height: '32px',
            width: 'inherit',
            border: '1px #E0E3E9',
            borderRadius: '5px',
            boxShadow: 'inset 0 0 0 1px #DEE0E7, inset 0 2px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)',
            color: '#545558',
            textIndent: '12px',
            textAlign: 'left',
            marginBottom: '16px',
            paddingLeft: '10px'
        },
        iconWrapper: {
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14
        },
        loaderWrapper: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh"
        },
        loaderTitle: {
            fontWeight: 600,
            fontSize: 17,
            marginTop: 28,
            marginBottom: 4,
            color: "#1d2028",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: 450,
        },
        loaderSubtitle: {
            fontWeight: 400,
            fontSize: 13,
            color: "#8d91a3",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: 450,
        },
    })
);

export default useStyles;
