/* eslint-disable react/jsx-props-no-spreading */
/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */

import React from 'react';

import {
  IconButton as MUIIconButton,
  IconButtonProps as MUIIconButtonProps,
} from '@material-ui/core';
import clsx from 'clsx';

import useStyles from './IconButton.styles';

type IconButtonProps<C extends React.ElementType = 'button'> =
  React.ComponentProps<C> &
    Omit<
      MUIIconButtonProps,
      | 'color'
      | 'disableTouchRipple'
      | 'focusRipple'
      | 'centerRipple'
      | 'disableRipple'
      | 'disableFocusRipple'
      | 'size'
    > & {
      rounded?: boolean;
      color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
      size?: 'medium' | 'small' | 'tiny';
      component?: C;
      testId: string;
      variant?: 'contained' | 'subtle' | 'outlined' | 'text' | 'link';
    };

const IconButton = <C extends React.ElementType = 'button'>(
  props: IconButtonProps<C>
) => {
  const {
    children,
    color = 'primary',
    variant = 'contained',
    rounded = false,
    fullWidth = false,
    size = 'medium',
    disabled = false,
    testId,
    classes,
    ...rest
  } = props;

  const iconButtonClasses = useStyles();
  const isPrimary = color === 'primary';
  const isSecondary = color === 'secondary';
  const isError = color === 'error';
  const isSuccess = color === 'success';
  const isWarning = color === 'warning';

  const isText = variant === 'text';
  const isOutlined = variant === 'outlined';
  const isContained = variant === 'contained';
  const isSubtle = variant === 'subtle';
  const isLink = variant === 'link';

  const isSmall = size === 'small';
  const isTiny = size === 'tiny';

  return (
    <MUIIconButton
      classes={{
        root: clsx({
          [iconButtonClasses.commons]: true,
          [iconButtonClasses.fullWidth]: fullWidth,
          [iconButtonClasses.disabled]: disabled,
          [iconButtonClasses.outlined]: isOutlined,
          [iconButtonClasses.contained]: isContained,
          [iconButtonClasses.text]: isText,
          [iconButtonClasses.subtle]: isSubtle,
          [iconButtonClasses.link]: isLink,

          [iconButtonClasses.rounded]: rounded,
          [iconButtonClasses.smallRounded]: rounded && isSmall,
          [iconButtonClasses.tinyRounded]: rounded && isTiny,

          [iconButtonClasses.small]: !rounded && isSmall,
          [iconButtonClasses.tiny]: !rounded && isTiny,

          [iconButtonClasses.primaryContained]: isPrimary && isContained,
          [iconButtonClasses.primaryText]: isPrimary && isText,
          [iconButtonClasses.primaryOutlined]: isPrimary && isOutlined,
          [iconButtonClasses.primarySubtle]: isPrimary && isSubtle,
          [iconButtonClasses.primaryLink]: isPrimary && isLink,

          [iconButtonClasses.secondaryContained]: isSecondary && isContained,
          [iconButtonClasses.secondaryText]: isSecondary && isText,
          [iconButtonClasses.secondaryOutlined]: isSecondary && isOutlined,
          [iconButtonClasses.secondarySubtle]: isSecondary && isSubtle,
          [iconButtonClasses.secondaryLink]: isSecondary && isLink,

          [iconButtonClasses.successContained]: isSuccess && isContained,
          [iconButtonClasses.successText]: isSuccess && isText,
          [iconButtonClasses.successOutlined]: isSuccess && isOutlined,
          [iconButtonClasses.successSubtle]: isSuccess && isSubtle,
          [iconButtonClasses.successLink]: isSuccess && isLink,

          [iconButtonClasses.errorContained]: isError && isContained,
          [iconButtonClasses.errorText]: isError && isText,
          [iconButtonClasses.errorOutlined]: isError && isOutlined,
          [iconButtonClasses.errorSubtle]: isError && isSubtle,
          [iconButtonClasses.errorLink]: isError && isLink,

          [iconButtonClasses.warningContained]: isWarning && isContained,
          [iconButtonClasses.warningText]: isWarning && isText,
          [iconButtonClasses.warningOutlined]: isWarning && isOutlined,
          [iconButtonClasses.warningSubtle]: isWarning && isSubtle,
          [iconButtonClasses.warningLink]: isWarning && isLink,
          ...classes,
        }),
      }}
      disableRipple={true}
      disableTouchRipple={true}
      disableFocusRipple={true}
      centerRipple={false}
      data-cyid={`${testId}-icon-button`}
      {...rest}
    >
      {children}
    </MUIIconButton>
  );
};

export default IconButton;
