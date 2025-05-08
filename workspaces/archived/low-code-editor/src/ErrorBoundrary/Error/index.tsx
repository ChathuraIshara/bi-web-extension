import * as React from "react";
import { FormattedMessage } from "react-intl";

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ErrorSvg from "./ErrorSvg";
import { useStyles } from "./style";

export default function Default() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid
                container={true}
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.gridContainer}
            >
                <Grid item={true}>
                    <ErrorSvg />
                </Grid>
                <Grid item={true}>
                    <Typography variant="h1" className={classes.errorTitle} component="div">
                    <FormattedMessage id="lowcode.develop.errorBoundary.errorMessage.text" defaultMessage="Oops! This is embarrassing."/>
                    </Typography>
                </Grid>
                <Grid item={true}>
                    <Typography variant="subtitle1" component="div" className={classes.errorMsg}>
                    <FormattedMessage id="lowcode.develop.errorBoundary.tryAgainMessage.text" defaultMessage="Something went terribly wrong. Refresh and try again."/>
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}
