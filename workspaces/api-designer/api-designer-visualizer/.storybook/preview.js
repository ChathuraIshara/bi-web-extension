/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [
    (Story, context) => {
      if (context.globals.theme === 'Dark_Theme') {
        import('../.storybook/darkTheme.css');
      } else if (context.globals.theme === 'Light_Theme') {
        import('../.storybook/lightTheme.css');
      }
      import ("./fonts/@wso2-enterprise/font-wso2-vscode/dist/wso2-vscode.css");
      import ("./fonts/@vscode/codicons/dist/codicon.css");
      return <Story />
    }
];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'Light_Theme',
    toolbar: {
      icon: 'circlehollow',
      items: ['Light_Theme', 'Dark_Theme'],
    },
  },
};
