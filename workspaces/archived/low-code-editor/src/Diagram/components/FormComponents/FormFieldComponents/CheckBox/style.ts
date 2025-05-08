import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        root: {
            display: "flex",
        },

        checkbox: {
            color: '#2FA86C',

            "&$checked": {
                color: "#2FA86C",

                "&:hover": {
                    background: "transparent",
                },

                "& .MuiIconButton-label": {
                    position: "relative",
                    zIndex: 0,
                },

                "& .MuiIconButton-label::after": {
                    content: '""',
                    left: 1,
                    top: 1,
                    width: 19,
                    height: 19,
                    position: "absolute",
                    backgroundColor: "#fff",
                    zIndex: -1,
                    borderRadius: 3,
                }
            }
        },

        checked: {},

        checkFormControl: {
            margin: theme.spacing(0.5),
            marginTop: 0
        },

        disabled: {
            backgroundColor: "#afb9f6 !important",
            color: "#FFF !important",
        },
    })
);
