import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        primaryBtn: {
            textTransform: "capitalize",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            fontSize: 13,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.15)",
            "&:hover": {
                backgroundColor: "#5464D0",
                color: theme.palette.common.white,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px 0 rgba(0,0,0,0.07)"
            },
            "&:focus": {
                backgroundColor: theme.palette.primary.main,
                background: "linear-gradient(180deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0) 100%)",
                color: theme.palette.common.white,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 0 0 0 rgba(0,0,0,0.07)"
            },
            "&:active": {
                backgroundColor: theme.palette.primary.main
            }
        },
        secondaryBtn: {
            textTransform: "initial",
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.05)",
            fontSize: 13,
            height: theme.spacing(5),
            borderRadius: theme.spacing(3),
            paddingRight: theme.spacing(3.5),
            paddingLeft: theme.spacing(3.5),
            "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.05)",
            },
            "&:active": {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.05)",
            },
            "&:focus": {
                background: "linear-gradient(180deg, rgba(0,0,0,0.09) 0%, rgba(0,0,0,0) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 0 0 0 rgba(0,0,0,0.07)"
            }
        },
        rounded: {
            height: theme.spacing(5),
            borderRadius: theme.spacing(2.5),
            paddingRight: theme.spacing(2.5)
        },
        square: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            height: theme.spacing(6),
            borderRadius: 5
        },
        iconBtnText: {
            marginLeft: -theme.spacing(0.5),
            marginTop: -theme.spacing(0.25)
        },
        btnText: {
            marginTop: -theme.spacing(0.25)
        },
        secondaryIconBtn: {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.primary.main,
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                boxShadow: "0 1px 4px 0 rgba(47, 50, 127, 0.33)"
            },
            "&:focus, &:active": {
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.primary.main,
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
        disabled : {
            backgroundColor: "#D5D8EE !important",
            color: "#FFFFFF !important",
            boxShadow: "0 0 0 0 rgba(0,0,0,0.07)",
            '&:hover, &:active, &:focus': {
                boxShadow: "none"
            }
        },
        greyBtnDisabled: {
            backgroundColor: `${theme.palette.secondary.light} !important`,
            color: "#CBCEDB !important",
            opacity: 0.75,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3), 0 0 0 0 rgba(0,0,0,0.07)",
            '&:hover, &:active, &:focus': {
                boxShadow: "none"
            }
        }
    })
);
