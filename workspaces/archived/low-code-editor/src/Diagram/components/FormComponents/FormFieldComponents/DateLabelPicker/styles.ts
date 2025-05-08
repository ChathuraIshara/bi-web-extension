import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dateTimeWrapper: {
            borderRadius: 6,
            backgroundColor: theme.palette.common.white,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
            cursor: "pointer",
            width: "100%",
            boxShadow: 'inset 0 0 0 1px #DEE0E7, inset 0 2px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)',
            textDecoration: 'none'
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        }
    })
);
