/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Meta } from '@storybook/react';
import React from 'react';
import { GraphqlView } from './GraphqlView';

export default {
  component: GraphqlView,
  title: 'Components/SwaggerView',
} as Meta;

export const Primary: React.VFC<{}> = () => <GraphqlView data={{ "serviceAPI": "http://localhost:8090" }}></GraphqlView>;
