/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Button from '@material-ui/core/Button';
import { Theme, withStyles } from '@material-ui/core/styles';

const DefaultButtonSquare = withStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(0.1),
    paddingRight: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    fontSize: theme.spacing(1.2),
  },
  label: {
    textTransform: 'initial'
  }
}))(Button) as typeof Button;

export default DefaultButtonSquare;
