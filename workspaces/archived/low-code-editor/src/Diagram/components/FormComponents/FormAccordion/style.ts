/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        groupedForm: {
            height: "auto",
            width: "100%",
            backgroundColor: "#FFF",
            paddingBottom: "0.5rem",
            ":not(.codeWrapper)" : {
                "& .MuiInputBase-root": {
                    width: '100% !important',
                },
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
                "& div": {
                    margin: '0 !important',
                }
            }
        },
        accordionWrapper: {
            width: '100%',
        },
        activeAccordionRoot: {
            margin: '0 !important',
            padding: 0,
            border: "2px solid #DEE0E7",
            boxShadow: 'none',
            borderRight: 0,
            borderTop: 0,
            borderBottom: 0,
            '&:not(:last-child)': {
                marginTop: 0,
            },
            '&:first-child': {
                marginBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '& .Mui-expanded': {
                margin: 0,
            },
            '& .MuiIconButton-edgeEnd': {
                margin: 'unset',
            },
            '& .MuiExpansionPanelSummary-expandIcon': {
                display: 'none'
            },
            expanded: { },
        },
        activeAccordionRootFirst: {
            margin: '0 !important',
            padding: 0,
            boxShadow: 'none',
            borderRight: 0,
            borderTop: 0,
            borderBottom: 0,
            '&:not(:last-child)': {
                marginTop: 0,
            },
            '&:first-child': {
                marginBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '& .Mui-expanded': {
                margin: 0,
            },
            '& .MuiIconButton-edgeEnd': {
                margin: 'unset',
            },
            '& .MuiExpansionPanelSummary-expandIcon': {
                display: 'none'
            },
            expanded: { },
        },
        accordionRoot: {
            margin: '0 !important',
            padding: 0,
            border: "2px solid #DEE0E7",
            boxShadow: 'none',
            borderRight: 0,
            borderTop: 0,
            borderBottom: 0,
            '&:not(:last-child)': {
                marginTop: 0,
            },
            '&:first-child': {
                marginBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '& .Mui-expanded': {
                margin: 0,
            },
            '& .MuiIconButton-edgeEnd': {
                margin: 'unset',
            },
            expanded: { },
        },
        accordionRootFirst: {
            margin: '0 !important',
            padding: 0,
            boxShadow: 'none',
            borderRight: 0,
            borderTop: 0,
            borderBottom: 0,
            '&:not(:last-child)': {
                marginTop: 0,
            },
            '&:first-child': {
                marginBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '& .Mui-expanded': {
                margin: 0,
            },
            '& .MuiIconButton-edgeEnd': {
                margin: 'unset',
            },
            expanded: { },
        },
        accordionSummary: {
            padding: '0 0 0 16px',
            minHeight: '32px !important',
            root: {
                marginBottom: -1,
                padding: '0 0 0 16px',
                '& .Mui-expanded': {
                    minHeight: '32px !important',
                },
            },
            expanded: {
                backgroundColor: 'lavender',
            },
        },
        accordionSummaryFirst: {
            padding: 0,
            minHeight: '32px !important',
            root: {
                marginBottom: -1,
                padding: 0,
                '& .Mui-expanded': {
                    minHeight: '32px !important',
                },
            },
            expanded: {
                backgroundColor: 'lavender',
            },
        },
        accordionDetails: {
            padding: '0 0 0 16px',
            root: {
                display: 'flex',
            },
        },
        accordionDetailsFirst: {
            padding: 0,
            root: {
                display: 'flex',
            },
        },
        accordionHeading: {
            color: theme.palette.text.primary,
            fontSize: "13px",
            fontWeight: 500,
            textTransform: 'capitalize',
        },
        accordionSecondaryHeading: {
            color: theme.palette.text.secondary,
            fontSize: "13px",
            fontWeight: 500,
            textTransform: 'capitalize',
        },
        accordionSecondaryRedHeading: {
            color: '#DC143C',
            fontSize: "13px",
            textTransform: 'capitalize',
        },
    }),
);
