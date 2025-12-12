import type { Meta, StoryObj } from '@storybook/react';
import HomeScreen from './HomeScreen';

const meta: Meta<typeof HomeScreen> = {
  title: 'Game/HomeScreen',
  component: HomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onStart: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
