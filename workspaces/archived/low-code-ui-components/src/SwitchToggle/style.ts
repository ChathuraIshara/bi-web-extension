import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: theme.spacing(5.25),
            height: theme.spacing(3),
            padding: 0,
            display: 'flex',
        },
        switchWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            "& .MuiFormControlLabel-root" : {
                justifyContent: 'space-between',
                flexDirection: 'row-reverse',
                margin: '1rem 0'
            }
        },
        switchBase: {
            padding: theme.spacing(0.375),
            '&.MuiIconButton-root:hover': {
                backgroundColor: "transparent"
            },
            '&.Mui-checked': {
                transform: 'translateX(18px)',
                '& .MuiSwitch-thumb': {
                    color: `${theme.palette.success.main} !important`,
                },
                '& + $track': {
                    opacity: 1,
                    background: "linear-gradient(180deg, #F5F5F9 0%, #FFFFFF 100%)",
                    boxShadow: "inset 0 0 0 1px #36B475, 0 1px 2px -1px rgba(141,145,163,0.21)",
                },
            },
        },
        thumb: {
            width: theme.spacing(2.25),
            height: theme.spacing(2.25),
            boxShadow: 'none',
            color: theme.palette.grey[400]
        },
        track: {
            borderRadius: theme.spacing(2),
            opacity: 1,
            background: "linear-gradient(180deg, #F5F5F9 0%, #FFFFFF 100%)",
            boxShadow: "inset 0 0 0 1px #CBCEDB, 0 1px 2px -1px rgba(141,145,163,0.21)",
        },
        toggleTitle: {
            fontWeight: 500,
            fontSize: 14,
            color: '#222228',
            letterSpacing: 0,
        },
        checked: {},
        switchTextWrapper: {}
    }),
);

