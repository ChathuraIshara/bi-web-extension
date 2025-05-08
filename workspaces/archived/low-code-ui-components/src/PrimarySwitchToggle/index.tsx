/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Theme, withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const PrimarySwitchToggle = withStyles((theme: Theme) => ({
  root: {
    width: theme.spacing(5.25),
    height: theme.spacing(3),
    padding: 0,
    display: 'flex',
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
  track: {
    borderRadius: theme.spacing(2),
    opacity: 1,
    background: "linear-gradient(180deg, #F5F5F9 0%, #FFFFFF 100%)",
    boxShadow: "inset 0 0 0 1px #CBCEDB, 0 1px 2px -1px rgba(141,145,163,0.21)",
  },
  thumb: {
    width: theme.spacing(2.25),
    height: theme.spacing(2.25),
    boxShadow: 'none',
    color: theme.palette.grey[400]
  },
  checked: {},
  disabled: {}
}))(Switch) as typeof Switch;

export default PrimarySwitchToggle;
