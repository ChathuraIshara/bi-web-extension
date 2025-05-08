import { Meta } from '@storybook/react';
import type { StoryObj } from '@storybook/react';

import { SequenceView } from '../..';

const meta: Meta = {
    title: 'Example/SequenceView',
    component: SequenceView,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};