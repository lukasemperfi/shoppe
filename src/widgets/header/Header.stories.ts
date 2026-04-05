import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Header from './Header.vue'

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    cartCount: { control: { type: 'number', min: 0, max: 120 } },
  },
  args: {
    cartCount: 1,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
