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

import { useMemo } from 'react';

import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import systemTheme from './systemTheme';

export default function useChoreoTheme(userPreference: null | boolean = null) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isDarkMode = userPreference ?? prefersDarkMode;

  // We need to remove the darkPalette property from the theme since the default MUI theme does not have that
  const themeWithType = systemTheme;
  if (isDarkMode && themeWithType.darkPalette) {
    themeWithType.palette = themeWithType.darkPalette;
  }
  if (themeWithType.darkPalette) {
    delete themeWithType.darkPalette;
  }
  const theme = useMemo(

    () => responsiveFontSizes(createTheme(themeWithType)),
    [prefersDarkMode]
  );

  return theme;
}
