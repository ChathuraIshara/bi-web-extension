/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        linkBtn: {
            textTransform: "capitalize",
            border: "0px solid",
            borderColor: "none",
            backgroundColor: "#fff",
            color: "#36B475",
            fontSize: 13,
            height: 30,
            borderRadius: 0,
            paddingRight: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            boxShadow: "none",
            "&:hover": {
                backgroundColor: "#fff",
                color: "green",
                boxShadow: "none",
                cursor: "pointer",
            },
            "&:focus": {
                backgroundColor: "#fff",
                color: "green",
                boxShadow: "none",
                cursor: "pointer",
            },
            "&:active": {
                backgroundColor: "#fff",
                color: "green",
                boxShadow: "none",
            }
        },
        primaryBtn: {
            textTransform: "capitalize",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            borderRadius: 5,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
            fontSize: 13,
            height: 35,
            width: "auto",
            verticalAlign: "middle",
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                cursor: "pointer",
            },
            "&:focus": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                cursor: "pointer",
            },
            "&:active": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white
            }
        },
        squareSmall: {
            height: theme.spacing(4)
        },
        squareSmallText: {
            fontSize: 11
        },
        iconBtnText: {
            marginLeft: -theme.spacing(0.5),
            marginTop: -theme.spacing(0.25)
        },
        greyBtnDisabled: {
            backgroundColor: `${theme.palette.secondary.light} !important`,
            color: "#CBCEDB !important",
            opacity: 0.75,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3), 0 0 0 0 rgba(0,0,0,0.07)",
            '&:hover, &:active, &:focus': {
                boxShadow: "none"
            }
        },
        greyBtn: {
            textTransform: "capitalize",
            color: "#40404B",
            fontSize: 13,
            backgroundColor: theme.palette.secondary.light,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.05)",
            "&:hover": {
                backgroundColor: theme.palette.secondary.light,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.12)",
            },
            "&:focus, &:active": {
                backgroundColor: theme.palette.secondary.light,
                background: "linear-gradient(180deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 0 0 0 rgba(0,0,0,0.07)",
            }
        },
        linePrimaryBtn: {
            textTransform: "capitalize",
            backgroundColor: "#fff",
            color: theme.palette.primary.main,
            borderRadius: 5,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
            fontSize: 13,
            height: 35,
            width: "auto",
            verticalAlign: "middle",
            border: "1px solid #5667d5",
            "&:hover": {
                backgroundColor: "#d7ddff24" ,
                color: theme.palette.primary.main,
                cursor: "pointer",
                boxShadow: "none"
            },
            "&:focus": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                cursor: "pointer",
            },
            "&:active": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white
            }
        },
        secondaryBtn: {
            textTransform: "capitalize",
            backgroundColor: "#f7f8fb",
            color: "#40404B",
            fontSize: 13,
            height: 35,
            width: "auto",
            verticalAlign: "middle",
            margin: "0 0.6rem 0 0",
            borderRadius: 5,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.05)",
            "&:hover": {
                backgroundColor: theme.palette.secondary.light,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.12)",
            },
            "&:focus, &:active": {
                backgroundColor: theme.palette.secondary.light,
                background: "linear-gradient(180deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 0 0 0 rgba(0,0,0,0.07)",
            }
        },
        square: {
            height: 35,
            borderRadius: 5,
            boxShadow: "0 1px 2px 0 rgba(47, 50, 127, 0.26)",
            "&:hover": {
                boxShadow: "0 3px 10px -2px rgba(47, 50, 127, 0.4)"
            }
        },
        btnText: {
            marginLeft: -theme.spacing(0.5)
        },
        disabled: {
            color: "#FFFFFF !important",
            backgroundColor: '#D5D8F0 !important',
        },
        iconBtnIcon: {
            height: "25px",
            width: "25px",
            borderRadius: "50%",
            border: "0px solid #5667d5",
            color: "#5667d5",
            fontSize: "12px"
        },
        iconBtn: {
            textTransform: "capitalize",
            border: "0px solid",
            borderColor: "none",
            backgroundColor: "#fff",
            color: "#5667d5",
            fontSize: 13,
            height: 30,
            borderRadius: 0,
            paddingRight: "10px !important",
            paddingLeft: "0px !important",
            marginTop: "10px !important",
            boxShadow: "none",
            "&:hover": {
                backgroundColor: "#fff",
                color: "#6070d6",
                boxShadow: "none",
                cursor: "pointer",
            },
            "&:focus": {
                backgroundColor: "#fff",
                color: "#6070d6",
                boxShadow: "none",
                cursor: "pointer",
            },
            "&:active": {
                backgroundColor: "#fff",
                color: "#6070d6",
                boxShadow: "none",
            }
        },
        iconBtnDisable: {
            opacity: 0.5,
            background: '#fff !important',
            color: '#5467d5 !important'
        }
    })
);
