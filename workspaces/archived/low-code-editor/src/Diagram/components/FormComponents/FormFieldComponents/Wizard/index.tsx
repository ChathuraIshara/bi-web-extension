/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Check from '@material-ui/icons/Check';
import { PrimaryButton, SecondaryButton } from '@wso2-enterprise/ballerina-low-code-edtior-ui-components';
import clsx from 'clsx';
// tslint:disable-next-line: no-implicit-dependencies
import PropTypes from 'prop-types';

import "./style.scss"

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 5,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    line: {
        borderColor: '#fff',
        borderTopWidth: 0,
        borderRadius: 0,
        borderLeftWidth: 20,
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: 98,
        height: 6,
        backgroundColor: '#CBCEDB',
        overflow: 'hidden',
    },
    active: {
        backgroundColor: '#5567D5',
    },
    circle: {
        width: 0,
        height: 0,
        borderRadius: '0%',
        backgroundColor: 'currentColor',
    },
    completed: {
        zIndex: 1,
        fontSize: 0,
        backgroundColor: '#5567D5',
        width: 98,
        height: 6,
        overflow: 'hidden',
    },
});

function QontoStepIcon(props: { active: any; completed: any; }) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, { [classes.active]: active })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 50,
        fontSize: '10px !important',
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        color: 'yellow',
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: "100vh",
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['CONNECTION', 'OPERATION', 'INPUT/OUTPUT'];
}

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return 'CONNECTION';
        case 1:
            return '';
        case 2:
            return 'INPUT / OUTPUT';
        default:
            return 'SETTINGS';
    }
}

export default function CustomizedSteppers() {
    const classes = useStyles();
    const intl = useIntl();
    const [activeStep, setActiveStep] = React.useState(1);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const resetButtonText = intl.formatMessage({
        id: "lowcode.develop.elements.wizard.resetButton.text",
        defaultMessage: "Reset"
    });

    return (
        <div className={classes.root}>
            <Stepper
                // tslint:disable-next-line: jsx-boolean-value jsx-no-multiline-js
                alternativeLabel
                activeStep={activeStep}
                connector={<QontoConnector />}
            >
                {steps.map((label) => (
                    // tslint:disable-next-line: jsx-no-multiline-js
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon} >{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ?
                    // tslint:disable-next-line: jsx-no-multiline-js
                    ((
                        <div>
                            <Typography className={classes.instructions}>
                            <FormattedMessage id="lowcode.develop.elements.wizard.stepsCompleted.text" defaultMessage="All steps completed"/>
                            </Typography>
                            <div className="button-container">
                                <SecondaryButton onClick={handleReset} className={classes.button}>
                                    {resetButtonText}
                                </SecondaryButton>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            <div className="button-container">
                                <SecondaryButton text="Back" disabled={activeStep === 0} onClick={handleBack} className={classes.button} />
                                <PrimaryButton
                                    variant="contained"
                                    onClick={handleNext}
                                    className={classes.button}
                                    text={activeStep === steps.length - 1 ? 'Save & Done' : 'Save & Next'}
                                />
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
