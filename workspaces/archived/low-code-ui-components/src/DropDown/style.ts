/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

export const useStyles = makeStyles(() =>
    createStyles({
        selectDropDown: {
            height: 32,
            width: "100%",
            borderRadius: 5,
            background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
            boxShadow: "inset 0 0 0 1px #dee0e7, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            marginBottom: theme.spacing(2.5),
            border: 1,
            "&:active": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5",
            },
            "&:focused": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5 !important",
            },
            '& .MuiSelect-icon': {
                marginRight: 20,
            },
            "& .MuiSelect-selectMenu": {
                height: "inherit !important",
                paddingleft: 10,
                "& .TextSpan": {
                    top: "calc(50% - 8px)",
                    position: "absolute",
                }
            },
            "& .MuiSelect-select.MuiSelect-select": {
                padding: "0 15px",
            }
        },
        selectDropDownSm: {
            height: 35,
            width: "100%",
            borderRadius: 5,
            background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
            boxShadow: "inset 0 0 0 1px #dee0e7, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            marginBottom: theme.spacing(2.5),
            border: 1,
            "&:active": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5",
            },
            "&:focused": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5 !important",
            },
            '& .MuiSelect-icon': {
                marginRight: 20,
            },
            "& .MuiSelect-selectMenu": {
                height: "inherit !important",
                paddingleft: 10,
                "& .TextSpan": {
                    top: "calc(50% - 8px)",
                    position: "absolute",
                    maxWidth: "156px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }
            },
            "& .MuiSelect-select.MuiSelect-select": {
                padding: "0 15px"
            }
        },
        dropdownStyle: {
            backgroundColor: "#fff",
            boxSizing: "border-box",
            width: "auto",
            border: "1px solid #DEE0E7",
            borderRadius: "5px",
            boxShadow: "0 5px 10px -3px rgba(50,50,77,0.1)",
            color: "#222228",
            marginTop: '0.25rem',
        },
        actionIcon: {
            padding: "0",
            width: "36px",
        },
        label: {
            padding: 0,
            color: "#1D2028 !important",
            fontSize: "13px !important",
        },
        selectOperationTextWrapper: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        createNewButton: {
            width: '100%',

        },
        itemWrapper: {
            display: "flex",
            flexDirection: "row"
        },
        iconTextWrapper: {
            marginTop: 11,
            marginLeft: 5,
            fontSize: 12
        },
        iconWrapper: {
            height: 14,
            width: 14,
            marginTop: 13,
            marginBottom: 13,
            marginLeft: 10
        },
        renderValueWrapper: {
            display: "flex",
            top: "calc(50% - 20px)",
            position: "absolute"
        },
        paramDropDown: {
            height: 35,
            width: "100%",
            borderRadius: 5,
            background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
            boxShadow: "inset 0 0 0 1px #dee0e7, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            marginBottom: theme.spacing(2.5),
            border: 1,
            "&:active": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5",
            },
            "&:focused": {
                background: "linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)",
                boxShadow: "inset 0 0 0 1px #a6b3ff, 0 1px 1px 0 rgba(0, 0, 0, 0.06)",
                border: "1px solid #5567d5 !important",
            },
            '& .MuiSelect-icon': {
                marginRight: 20,
            },
            "& .MuiSelect-selectMenu": {
                height: "inherit !important",
                paddingleft: 10,
                "& .TextSpan": {
                    top: "calc(50% - 8px)",
                    position: "absolute",
                    maxWidth: "156px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
                "& .MenuItemWrapper": {
                    top: "calc(50% - 20px)",
                    left: "calc(50% - 75px)",
                    position: "absolute",
                    maxWidth: "156px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    flexDirection: "column",
                    "& .IconWrapper": {
                        height: 14,
                        width: 14,
                        marginTop: 13,
                        marginBottom: 13,
                        marginLeft: 10
                    },
                    "& .IconTextWrapper": {
                        marginTop: 13,
                        marginLeft: 5,
                        lineHeight: "13px",
                        fontSize: 12
                    }
                }
            },
            "& .MuiSelect-select.MuiSelect-select": {
                padding: "0 15px",
                "& $componentWrapper": {
                    display: "none"
                }
            }
        },
    })
);
