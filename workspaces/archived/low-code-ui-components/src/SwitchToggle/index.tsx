/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

import React, { useEffect } from 'react';

import { Typography } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import cn from "classnames";

import { useStyles } from "./style";

export interface SwitchToggleProps {
  onChange: (checked: boolean) => void,
  text?: string;
  className?: string;
  initSwitch?: boolean;
  dataTestId?: string;
}

export function SwitchToggle(props: SwitchToggleProps) {
  const { text, onChange, initSwitch, dataTestId, className } = props
  const [checked, setChecked] = React.useState(initSwitch);
  const classes = useStyles();

  const toggleChecked = () => {
    setChecked((prev) => !prev);
    onChange(checked);
  };

  useEffect(() => {
    setChecked(initSwitch);
  }, [initSwitch]);

  return (
    <FormGroup className={classes.switchWrapper}>
      <FormControlLabel
        label={text ? (<Typography variant="body1" className={cn(classes.toggleTitle, className)}>{text}</Typography>) : null}
        control={
          (
            <Switch
              data-testid={dataTestId}
              classes={{ root: classes.root, switchBase: classes.switchBase, thumb: classes.thumb, track: classes.track }}
              checked={checked}
              onChange={toggleChecked}
            />
          )
        }
      />
    </FormGroup>
  );
}



