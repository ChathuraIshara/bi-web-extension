/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      height: "auto",
      display: 'flex',
      flexDirection: 'column',
    },
    stepper: {
      // marginTop: '1.5rem',
    },
    stepperWrapper: {
      display: "none",
      position: 'absolute',
      background: '#fff',
      zIndex: 900,
      marginTop: '-3.6rem',
      padding: '1rem 0',
    },
    stepWrapper: {
      height: 6,
      width: 122,
      zIndex: 1,
      fontSize: 0,
      backgroundColor: '#cbcedb',
      overflow: 'hidden',
    },
    stepContainer: {},
    stepLabel: {},
    completedStep: {
      zIndex: 1,
      height: 6,
      width: 155,
      fontSize: 0,
      backgroundColor: '#5567d5',
      overflow: 'hidden',
    },
    currentStep: {
      height: 6,
      width: 155,
    },
    stepActive: {
      backgroundColor: '#5567d5',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: '5.7rem',
      right: '1rem',
    }
  })
);
