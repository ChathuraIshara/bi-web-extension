
import { Meta } from '@storybook/react';

import { SwaggerView }  from './SwaggerView';

export default {
  component: SwaggerView,
  title: 'Components/SwaggerView',
} as Meta;

export const Primary: React.VFC<{}> = () => <SwaggerView></SwaggerView>;
