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
        container: {
            width: 338,
            paddingBottom: 12,
            paddingTop: 24,
            backgroundColor: "#fff",
            borderRadius: 5,
            boxShadow: "0 5px 10px 0 rgba(102, 103, 133, 0.27)",
            zIndex: 2
        },
        closeBtnWrapper: {
            background: 'none',
            color: '#cbcedb',
            border: 0,
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 10,
            cursor: 'pointer',
            outline: 'none',
        },
        closeBtn: {
            fontSize: 16,
            strokeWidth: 1,
            stroke: '#cbcedb',
            opacity: 1,
            fill: '#cbcedb',
        },
        titleWrapper: {
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 11,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },
        title: {
            marginBottom: 12,
            fontSize: 14.5,
            letterSpacing: 0,
            fontWeight: 500,
            color: "#222228",
        },
        subTitle: {
            color: "#1D2028",
            fontSize: 14,
            textTransform: "capitalize",
            fontWeight: 500,
        },
        textFieldLabel: {
            padding: 0,
            margin: 0,
            color: '#1D2028',
            fontSize: 14,
            textTransform: 'capitalize',
            display: 'inline-block',
            lineHeight: '35px'
        },
        triggerList: {
            // display: "flex",
            marginTop: 18,
        },
        trigger: {
            display: "flex",
            alignItems: "center",
            height: 40,
            // width: 150,
            '&:hover': {
                backgroundColor: '#E6E7EC',
                cursor: "pointer",
                borderRadius: 4
            }
        },
        triggerIcon: {
            width: 20,
            margin: 10,
        },
        triggerLabel: {
            height: 'auto',
            color: "#222228",
            fontSize: 13,
            letterSpacing: 0,
        },
        resourceWrapper: {
            marginBottom: "15px",
            padding: "5px 0"
        },
        sectionSeparator: {
            borderBottom: "1px solid #D8D8D8",
            marginBottom: 25,
            padding: "5px 0"
        },
        sectionSeparatorTop: {
            borderTop: "1px solid #D8D8D8",
            marginTop: "15px",
            padding: "5px 0"
        },
        customWrapper: {
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 11,
            "& .MuiFormControl-marginNormal": {
                margin: '0 !important'
            }
        },
        sectionWrapper: {
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 11,
            "& .MuiFormControl-marginNormal": {
                margin: '0 !important'
            }
        },
        customFooterWrapper: {
            marginLeft: 24,
            marginRight: 24,
            marginBottom: 11,
            display: "flex",
            justifyContent: "flex-end"
        },
        serviceFooterWrapper: {
            marginLeft: 24,
            marginBottom: 11,
            display: "flex",
            justifyContent: "flex-end"
        },
        selectedTriggerBox: {
            width: "100%",
            borderRadius: 5,
            borderColor: theme.palette.secondary.main,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 45,
            padding: "8px 8px 8px 11px"
        },
        selectedTriggerLabel: {
            display: "flex",
            alignItems: "center",
        },
        changeSelectedTrigger: {
            minWidth: "unset",
            padding: 3,
        },
        repoTextBox: {
            width: "100%",
            borderRadius: "5px",
            "&.MuiInputBase-root": {
                height: 45,
            },
            "&.MuiOutlinedInput-input": {
                height: 45,
            },
        },
        saveBtn: {
            // width: "100%",
        },
        addResourceBtn: {
            outline: "none",
            background: "transparent",
            border: "none",
            color: "#5567D5",
            fontSize: "13px",
            letterSpacing: 0,
            lineHeight: "16px",
            padding: 0,
            cursor: "pointer"
        },
        addResourceBtnWrap: {
            display: "flex",
            alignItems: "center"
        },
        linkBtn: {
            marginTop: 12,
            color: theme.palette.primary.main
        },
        radioBtnWrapper: {
            "& .MuiFormGroup-root": {
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
            },
            "& .MuiFormControlLabel-root": {
                width: "48%",
            },
        },
        loader: {
            marginTop: 16,
            marginBottom: 18,
        },
        loaderTitle: {
            textAlign: "center",
        },
        customLabel: {
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            fontSize: 13,
            textAlign: "right",
            marginTop: "0.5rem",
            fontWeight: 500,
            '&:hover': {
                textDecoration: "underline"
            }
        },
        hrDivider: {
            background: theme.palette.primary.main,
            borderTop: "0 solid #dee0e7"
        },
        cronWrapper: {
            height: 48,
            width: "100%",
            borderRadius: 5,
            backgroundColor: "#FFFFFF",
            boxShadow: "inset 0 0 0 1px #DEE0E7, inset 0 2px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 0 rgba(50, 50, 77, 0.07)",
            display: "flex"
        },
        cronColumns: {
            width: '20%',
            overflow: 'hidden',
            marginTop: '-0.5rem'
        },
        cronColumnDropDown: {
            border: 0,
            boxShadow: 'none',
            background: 'none',
            marginTop: '1.5rem',
            textAlign: 'center',
            "& .MuiSelect-icon": {
                display: 'none'
            },
            "& .MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInput-input": {
                fontSize: 20
            }
        },
        activeConnectionWrapper: {
            display: "flex",
            marginTop: -8,
            marginBottom: 8,
            marginLeft: 23,
            marginRight: 23,
            alignItems: "center"
        },
        activeConnectionWrapperChild1: {
            flexGrow: 1
        },
        activeConnectionBox: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: 5,
            padding: theme.spacing(0.5),
            borderColor: "#ff000000",
            border: "0px solid",
            '& .MuiFormControlLabel-root': {
                width: "100%",
            },
            '& span.MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1': {
                whiteSpace: "nowrap",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }
        },
        radioBtnSubtitle: {
            fontSize: 13,
            color: "#222228",
            margin: "-5px 0",
            paddingLeft: theme.spacing(1.5)
        },
        changeConnectionBtn: {
            padding: 9,
            border: "1px solid #E6E7EC",
            borderRadius: "50%",
            cursor: "pointer"
        },
        avatar: {
            height: theme.spacing(4),
            width: theme.spacing(4),
            background: "linear-gradient(219.72deg, #5567D5 0%, #7148CF 44.71%, #BB43B2 78.02%, #ED477D 100%)",
            color: theme.palette.common.white,
            fontSize: 13
        },
        letterAvatar: {
            opacity: 0.73
        },
        editIcon: {
            cursor: "pointer",
            width: "16px"
        },
        deleteBtnWrapper: {
            cursor: "pointer",
            width: 130,
            marginBottom: 10,
            display: "flex",
            alignItems: "center"
        },
        deleteButtonTitle: {
            marginLeft: 7,
            fontSize: 13,
            color: "#FE523C",
        },
        returnTextBoxWrapper: {
            marginBottom: 10
        }
    })
);
