/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Button from '@material-ui/core/Button';
import { Theme, withStyles } from '@material-ui/core/styles';

const PrimaryRounded = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1.2),
    paddingTop: theme.spacing(1.2),
    fontSize: theme.spacing(1.5),
  },
}))(Button) as typeof Button;

export default PrimaryRounded;
